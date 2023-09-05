const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const Contract = require("../models/contract");
const { authenticate } = require("./users");

// Get transaction by ID
router.get("/:id", authenticate, getTransaction, (req, res) => {
  res.json(res.transaction);
});

// Create new transaction
router.post("/", authenticate, async (req, res) => {
  const { contractId, type, ...transactionData } = req.body;

  const contract = await Contract.findById(contractId);
  if (!contract) {
    return res.status(400).json({ message: "Contract not found" });
  }

  let transactionDataWithId;
  
  if(type === "internal") {
    transactionDataWithId = {
      ...transactionData,
      internal_transaction: {
        contract_id: contractId
      }
    }
  } else if(type === "external") {
    transactionDataWithId = {
      ...transactionData,
      external_transaction: {
        wallet_id: contract.employer_wallet,
        ...transactionData.external_transaction // assuming 'action' is provided in request body
      }
    }
  } else {
    return res.status(400).json({ message: "Invalid transaction type" });
  }

  const transaction = new Transaction({ contract: contractId, type, ...transactionDataWithId });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Update transaction
router.patch("/:id", authenticate, getTransaction, async (req, res) => {
  Object.assign(res.transaction, req.body);
  try {
    const updatedTransaction = await res.transaction.save();
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete transaction
router.delete("/:id", authenticate, getTransaction, async (req, res) => {
  try {
    await Transaction.deleteOne({ _id: res.transaction._id });
    res.json({ message: "Transaction deleted" });s
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getTransaction(req, res, next) {
  let transaction;
  try {
    transaction = await Transaction.findById(req.params.id).populate('contract');
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.transaction = transaction;
  next();
}

module.exports = router;
