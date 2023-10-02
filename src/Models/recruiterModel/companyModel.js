const mongoose = require("mongoose");
const {ObjectId} = require("mongoose").Types

const companyProfileSchema = new mongoose.Schema({
  profilePhoto: {
    type: String,
    trim: true,
},
  companyId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: function () {

      return generateUniqueId();
    },
  },
  companyName : {
    type: String,  //store the company photo URL
    required: true,
    trim: true,
  },

  companyPhoto: {
    type: String,  //store the company photo URL
    trim: true,
  },
  domains: {
    type: [String],
    required: true,
    trim: true,
  },
  aboutCompany: {
    type: String,
    required: true,
    trim: true,
  },
  website: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  recruiterId: {
    type: ObjectId,
    ref: "SignUp",
    trim: true,
  },
  recruiterDesignation : {
    type: String,
    required: true,
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
});

const CompanyProfile = mongoose.model("CompanyProfile", companyProfileSchema);

module.exports = CompanyProfile;
