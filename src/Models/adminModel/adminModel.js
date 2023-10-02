// models/Admin.js
const mongoose = require('mongoose');
const { ObjectId } = require("mongoose").Types;

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        trim: true,
      },
      bookmarkedJobs: [{
          type: ObjectId,
          ref: "JobPost",
        }],
      bookmarkedCandidateProfiles: [{
          type: ObjectId,
          ref: "Profile",
        }],
        bookmarkedCompanyProfiles: [{
          type: String,
          ref: "CompanyProfile",
        }]    
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
