const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["internal", "external"],
    required: true,
  },
  internal_transaction: {
    contract_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      required: function () {
        return this.type === "internal";
      },
    },
  },
  external_transaction: {
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: function () {
        return this.type === "external";
      },
    },
    action: {
      type: String,
      enum: ["deposit", "withdraw"],
      required: function () {
        return this.type === "external";
      },
    },
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
