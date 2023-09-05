const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  walletId: {
    type: String,
    unique: true,
    required: true,
  },
  last_active: {
    type: Date,
    default: Date.now,
  },
  balance: {
    type: Number,
    default: 0.0,
    get: v => parseFloat(v.toFixed(2)) 
  }
});

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;