const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  gender : {
    type: String, 
    enum:["Male", "Female", "Other"],
    default: "Other"
  },
  dob: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    minlength: 10,  
    unique: true,
  },
  document_image: {
    type: String,
    default: "",
  },
  document_id_number: {
    type: String,
    required: true,
  },  
  role: {
    type: String,
    enum: ['employee', 'employer'],
    default: "employee"
  },
  photo: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }, 
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",

  } 
});



const User = mongoose.model("User", userSchema);

module.exports = User;
