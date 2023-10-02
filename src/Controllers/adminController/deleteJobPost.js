const Admin = require("../../Models/adminModel/adminModel");
const SignUpModel = require("../../Models/signUpModel");
const JobPostModel = require("../../Models/recruiterModel/jobPostsModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const profileModel = require("../../Models/candidateModel/profileModel");

const { ObjectId } = require("mongoose").Types;


const deleteJobPost = async function (req, res) {
    try {
      let jobPostId = req.params.jobPostId;
      const jobPost = await JobPostModel.findOne({ _id: new ObjectId(jobPostId) });
      if (!jobPost) {
        return res.status(404).send({ message: "Job post doesn't exist" });
      }
  
      await JobPostModel.findByIdAndUpdate(jobPostId, { $set: { isDeleted: true } }, { new: true });
  
      return res.status(200).send({ message: "Job post deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  };
  
  module.exports = {deleteJobPost}