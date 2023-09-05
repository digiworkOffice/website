const express = require("express");
const router = express.Router();
const Wallet = require("../models/wallet");
const { authenticate } = require("./users");

// Get wallet by ID
router.get("/:id", authenticate, getWallet, (req, res) => {
  res.status(200).json(res.wallet);
});

// Update wallet load wallet
router.patch("/:id", authenticate, getWallet, async (req, res) => {
  Object.assign(res.wallet, req.body);
  try {
    const updatedWallet = await res.wallet.save();
    res.status(200).json(updatedWallet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  // create a transaction 
  
});

// Create wallet
async function getWallet(req, res, next) {
  let wallet;
  try {
    wallet = await Wallet.findById(req.params.id);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.wallet = wallet;
  next();
}
module.exports = router;