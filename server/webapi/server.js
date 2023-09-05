const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config(); // Call .config() here
const cors = require('cors');
const path = require('path');

// Now that dotenv has loaded the environment variables, we can require cronJob
require('./cronJob');

const app = express();
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cors());

const {router: userRoutes, authenticate} = require("./routes/users");
const walletRoutes = require("./routes/wallets");
const contractRoutes = require("./routes/contracts");
const transactionRoutes = require("./routes/transactions");
const adminRoutes = require("./routes/admin");

mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((error) => console.error("MongoDB connection error:", error));

app.use("/api/users" , userRoutes);
app.use("/api/wallets" , walletRoutes);
app.use("/api/contracts" , contractRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

