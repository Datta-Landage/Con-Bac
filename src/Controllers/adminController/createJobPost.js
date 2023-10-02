const Admin = require("../../Models/adminModel/adminModel");
const SignUpModel = require("../../Models/signUpModel");
const JobPostModel = require("../../Models/recruiterModel/jobPostsModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const profileModel = require("../../Models/candidateModel/profileModel");

const { ObjectId } = require("mongoose").Types;


const createJob = async function(req, res){
    try {
      const {
        jobTitle,
        summary,
        yearsOfExperience,
        salaryPackage,
        location,
        modeOfWork,
        typeOfEmployment,
        description,
        skillsAndTools,
        companyId,
      } = req.body;

  
      // Check if the company profile exists in the CompanyProfile collection
      const companyProfile = await CompanyProfileModel.findOne({companyId:companyId});
      if (!companyProfile) {
        return res.status(404).json({ error: "Company profile not found." });
      }
  
      const newJobPost = new JobPostModel({
        jobTitle,
        summary,
        yearsOfExperience,
        salaryPackage,
        location,
        modeOfWork,
        typeOfEmployment,
        description,
        skillsAndTools,
        companyId: companyProfile.companyId, // Save the companyId from the found company profile
        companySummary: companyProfile.aboutCompany, // Save the company summary from the found company profile
      });
  
      const savedJobPost = await newJobPost.save();
      res.status(201).send(savedJobPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create job post." });
    }
  };

  module.exports = {createJob}