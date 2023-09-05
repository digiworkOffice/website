const express = require("express");
const contractrouter = express.Router();
const Contract = require("../models/contract");
const { authenticate } = require("./users");
const Wallet = require("../models/wallet");
const User = require("../models/user");

// Get all contracts
contractrouter.get("/", authenticate, async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
contractrouter.get("/filter", authenticate, async (req, res) => {
  const { role, id } = req.query;
  let contracts;
  console.log(contracts);
  try {
    if (role === "employer") {
      contracts = await Contract.find({ employer_wallet: id });
    } else if (role === "employee") {
      contracts = await Contract.find({ employee_wallet: id });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get own contract by ID
contractrouter.get("/:id", authenticate, getContract, (req, res) => {
  res.json(res.contract);
});

// Create new contract
contractrouter.post("/", authenticate, async (req, res) => {
  if (req.body.role !== "employer") {
    return res.status(403).json({ error: "You are not authorized" });
  }
  const {
    employer_wallet,
    employee_wallet,
    collateral,
    duration,
    start_from,
    total_amount,
  } = req.body;
  const employee_wallet_get = await Wallet.findOne({ _id: employee_wallet });
  const employer_wallet_get = await Wallet.findOne({ _id: employer_wallet });
  const employer = await User.findOne({ wallet: employer_wallet_get });
  const employee = await User.findOne({ wallet: employee_wallet_get });

  // ensure start_from is at least 5 minutes later than now
  const startFrom = new Date(start_from);
  const now = new Date();
  if (startFrom - now < 5 * 60 * 1000) {
    // 5 minutes in milliseconds
    return res
      .status(400)
      .json({ error: "Start time should be at least 5 minutes from now" });
  }

  const employerWallet = await Wallet.findById(employer_wallet);
  if (!employerWallet) {
    return res.status(400).json({ error: "Employer wallet not found" });
  }
  const balance = employerWallet.balance;
  const amountToDivide = total_amount - collateral;

  const contract = new Contract({
    employer_wallet,
    employee_wallet,
    collateral,
    duration,
    start_from: startFrom,
    total_amount,
    transaction_amount_per_transfer: (amountToDivide * 60) / duration,
    employer_username: employer.username,
    employee_username: employee.username,
    paid_up_amount: collateral,
  });

  if (balance < total_amount / 3) {
    return res
      .status(403)
      .json({ error: "Insufficient balance to create this contract" });
  }

  try {
    const newContract = await contract.save();
    res.status(201).json(newContract);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});




// Update contract: id is contract id
contractrouter.put("/:id", authenticate, async (req, res) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ error: "You are not authorized" });
  }

  try {
    let contract = await Contract.findById(req.params.id);
    if (!contract)
      return res.status(404).json({ message: "Contract not found" });

    // Update the contract here
    // Iterate over keys in req.body
    for (let key in req.body) {
      // Only update if the contract has this field
      if (contract[key] !== undefined) {
        contract[key] = req.body[key];
      }
    }

    // Recalculate amount per transaction if total_amount or duration was updated
    if (req.body.total_amount !== undefined || req.body.duration !== undefined) {
      const amountToDivide = contract.total_amount - contract.collateral;
      contract.transaction_amount_per_transfer = (amountToDivide * 60) / contract.duration;
    }

    const updatedContract = await contract.save();
    res.status(200).json(updatedContract);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



async function getContract(req, res, next) {
  let contract;
  try {
    contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.contract = contract;
  next();
}
// Delete contract
contractrouter.delete("/:id", authenticate, async (req, res) => {
  try {
    const contract_get = await Contract.findById(req.params.id);
    contract_get.deleteOne();
    res.json({ message: "Contract deleted" });  
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// End contract
contractrouter.patch("/:id/end", authenticate, getContract, async (req, res) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ error: "You are not authorized" });
  }

  try {
    let contract = res.contract;

    // Update contract status
    contract.status = "ended";

    // Update other contract data from request body
    for (let key in req.body) {
      // Only update if the contract has this field
      if (contract[key] !== undefined) {
        contract[key] = req.body[key];
      }
    }

    const updatedContract = await contract.save();
    res.status(200).json(updatedContract);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = contractrouter;
