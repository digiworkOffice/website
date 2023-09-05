const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  employer_wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  employee_wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  employer_username: {
    type: String,
    default: "",
  },
  employee_username: {
    type: String,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  start_from: {
    type: Date,
    required: true,
  },
  employer_signed: {
    type: Boolean,
    default: false,
  },
  employee_signed: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  has_ended: {
    type: Boolean,
    default: false,
  },
  paid_up_amount: {
    type: Number,
    default: 0,
  },
  transaction_amount_per_transfer: {
    type: Number,
    required: true,
  },
  collateral: {
    type: Number,
    required: true,
  },
  renew: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "paused", "halted", "expired"],
    default: "active",
  },
  reminder_20: {
    type: Boolean,
    default: false,
  },
  reminder_10: {
    type: Boolean,
    default: false,
  },
  reminder_5: {
    type: Boolean,
    default: false,
  },
});

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
