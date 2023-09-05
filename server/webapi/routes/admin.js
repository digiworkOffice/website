const express = require("express");
const adminRoutes = express.Router();
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Contract = require("../models/contract");
const User = require("../models/user");
const Transaction = require("../models/transaction");

function authenticateAdmin(req, res, next) {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).json({ error: "No token. Authorization denied" });
  }

  // Extract the token without the "Bearer " prefix
  const token = bearerToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ADMINSECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
}

adminRoutes.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Admin already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      email: email,
      password: hashedPassword,
    });

    const savedAdmin = await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin registered successfully", user: savedAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRoutes.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.ADMINSECRET,
      { expiresIn: "5h" }
    );

    console.log(token);

    res.status(200).json({ token, user: admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRoutes.post("/loginWithToken", async (req, res) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).json({ error: "No token. Authorization denied" });
  }

  const token = bearerToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ADMINSECRET);
    req.user = decoded;
    res.status(200).json(decoded);
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
});

// Fetch all users
adminRoutes.get("/users",  authenticateAdmin,async (req, res) => {
  const users = await User.find({});
  return res.status(200).json(users);
});

// Fetch users who are employers
adminRoutes.get("/users/employers", authenticateAdmin, async (req, res) => {
  const users = await User.find({ role: "employer" });
  return res.status(200).json(users);
});

// Fetch users who are employees
adminRoutes.get("/users/employees", authenticateAdmin, async (req, res) => {
  const users = await User.find({role: "employee" });
  return res.status(200).json(users);
});




// Get all contracts
adminRoutes.get("/", authenticateAdmin, async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get only active contracts
adminRoutes.get("/active", authenticateAdmin, async (req, res) => {
  try {
    const contracts = await Contract.find({ status: "active" });
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update wallet balance
adminRoutes.patch("/:id/balance", authenticateAdmin, async (req, res) => {
  if (req.body.balance != null) {
    res.wallet.balance = req.body.balance;
  }

  try {
    const updatedWallet = await res.wallet.save();
    res.status(200).json(updatedWallet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get total transaction amount
adminRoutes.get("/totalTransactionAmount", authenticateAdmin, async (req, res) => {
  try {
    const contracts = await Contract.find();
    const totalTransactionAmount = contracts.reduce((sum, contract) => {
      return sum + contract.paid_up_amount;
    }, 0);
    res.json({ totalTransactionAmount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Update contract: id is contract id
adminRoutes.put("/contracts/:id", authenticateAdmin, async (req, res) => {

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




// Delete contract
adminRoutes.delete("/contracts/:id", authenticateAdmin, async (req, res) => {
  try {
    const contract_get = await Contract.findById(req.params.id);
    contract_get.deleteOne();
    res.json({ message: "Contract deleted" });  
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// End contract
adminRoutes.patch("/contracts/:id/end", authenticateAdmin, async (req, res) => {


  try {
    let contract = Contract.findById(req.params.id);

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






module.exports = adminRoutes;