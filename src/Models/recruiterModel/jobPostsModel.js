const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;

const jobPostSchema = new mongoose.Schema({
  recruiterId: {
    type: String,
    required: true,
    trim: true,
  },
  companyLogo: {
    type: String,
    trim: true,
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  salaryPackage: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  modeOfWork: {
    type: String,
    required: true,
    trim: true,
  },
  typeOfEmployment: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  skillsAndTools: [String],
  createDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Open", "Closed", "Expired"],
    default: "Open",
  },
  companyId: {
    type: String,
    ref: "CompanyProfile",
    required: true,
    trim: true,
  },
  companySummary: {
    type: String, // Assuming company summary is a string
    required: true,
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const JobPostModel = mongoose.model("JobPost", jobPostSchema);

module.exports = JobPostModel;
