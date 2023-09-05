const Transaction = require("../models/transaction");
const Wallet = require("../models/wallet");

exports.createTransaction = async (req, res) => {
  try {
    const { wallet_id, amount, type, action, contract_id } = req.body;

    const newTransaction = new Transaction({
      wallet_id,
      amount,
      type,
      action,
      contract_id,
    });

    const savedTransaction = await newTransaction.save();

    if (action === "deposit") {
      await Wallet.findByIdAndUpdate(wallet_id, { $inc: { balance: amount } });
    } else if (action === "withdraw") {
      await Wallet.findByIdAndUpdate(wallet_id, { $inc: { balance: -amount } });
    }

    res.status(201).json({ message: "Transaction created successfully", transaction: savedTransaction });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};