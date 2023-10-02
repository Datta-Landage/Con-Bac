const mongoose = require("mongoose");

const signUpSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  accountType: {
    type: String,
    enum: ["Recruiter", "Candidate"],
    trim: true,
  },
  profilePhoto: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  alternateNumber: {
    type: String,
    trim: true,
  },
  alternateEmail: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  addressLine1: {
    type: String,
    trim: true,
  },
  addressLine2: {
    type: String,
    trim: true,
  },
  postalCode: {
    type: Number,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  OAuth: {
    type: String,
  },
  name: {
    type: String,
  },
  user_handle: {
    type: String,
  },
});

const SignUpModel = mongoose.model("SignUp", signUpSchema);

module.exports = SignUpModel;
