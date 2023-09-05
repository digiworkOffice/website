const express = require("express");
const userRoutes = express.Router();
const User = require("../models/user");
var bcrypt = require("bcrypt");
const Wallet = require("../models/wallet");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const uploadProfilePic = require("../middlewares/upload_profile_pic");
const uploadDocs = require("../middlewares/upload_docs");

userRoutes.post("/register", async (req, res) => {
  try {
    const {
      username,
      fullname,
      dob,
      address,
      email,
      phone,
      role,
      document_id_number,
      password,
      document_image,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newWallet = new Wallet({
      walletId: uuid.v4(),
    });

    await newWallet.save();
    const newUser = new User({
      username: username,
      fullname,
      dob,
      address,
      email,
      phone,
      role,
      document_id_number,
      document_image,
      password: hashedPassword,
      wallet: newWallet._id,
    });

    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRoutes.put("/:id", authenticate, async (req, res) => {
  try {
    const {
      username,
      fullname,
      dob,
      address,
      phone,
      role,
      document_id_number,
    } = req.body;
    const { id } = req.params;

    if (req.user.id !== id) {
      return res
        .status(403)
        .json({ error: "You can only update your own profile" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (fullname) user.fullname = fullname;
    if (dob) user.dob = dob;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (document_id_number) user.document_id_number = document_id_number;

    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRoutes.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
userRoutes.post("/checkavailability", async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    const existingPhone = await User.findOne({ phone });

    let response = {};

    if (existingUsername) {
      response.username = "Username already taken.";
    } else {
      response.username = "Username available.";
    }

    if (existingEmail) {
      response.email = "Email already registered.";
    } else {
      response.email = "Email available.";
    }

    if (existingPhone) {
      response.phone = "Phone number already registered.";
    } else {
      response.phone = "Phone number available.";
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
});

userRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

userRoutes.get("/getUserByWalletId/:walletId", async (req, res) => {
  const { walletId } = req.params;
  try {
    const user = await User.findOne({ walletId: walletId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRoutes.post("/loginWithToken", async (req, res) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).json({ error: "No token. Authorization denied" });
  }

  // Extract the token without the "Bearer " prefix
  const token = bearerToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    res.status(200).json(decoded);
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
});

function authenticate(req, res, next) {
  const bearerToken = req.headers.authorization;
  console.log(bearerToken);

  if (!bearerToken) {
    return res.status(401).json({ error: "No token. Authorization denied" });
  }

  // Extract the token without the "Bearer " prefix
  const token = bearerToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
}
const verifyemployer = (req, res, next) => {
  if (req.user.role === "employer") return next();
  res.status(403).json({ error: "You are not authorized" });
};
userRoutes.post(
  "/uploadImage",
  authenticate,
  uploadProfilePic,
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file" });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // set photo field to the filename of the uploaded file
      user.photo = req.file.filename;
      await user.save();

      res.status(200).json({
        success: true,
        data: req.file.filename,
      });
    } catch (error) {
      res.status(500).send({ message: "Server error" });
    }
  }
);

userRoutes.post("/uploadDocs", uploadDocs, (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});

// Fetch all employees
userRoutes.post("/employees", async (req, res) => {
  try {
    // Use your own logic to filter out 'employee' roled users, I am assuming role is a field in your user model
    const employees = await User.find({ role: "employee" });

    // Respond with the array of employees
    res.status(200).json(
      employees.map((employee) => ({
        username: employee.username,
        walletId: employee.wallet._id,
      }))
    );
  } catch (error) {
    // Respond with error message if an error occurred
    console.error("Error while fetching employees: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching employees" });
  }
});
userRoutes.delete("/", authenticate, async (req, res) => {
  try {
    const id = req.user.id; // assuming 'req.user' is set by 'authenticate' middleware

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete associated wallet
    await Wallet.findByIdAndDelete(user.wallet);

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  router: userRoutes,
  authenticate,
  verifyemployer,
};
