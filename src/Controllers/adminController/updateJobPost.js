const Admin = require("../../Models/adminModel/adminModel");
const SignUpModel = require("../../Models/signUpModel");
const JobPostModel = require("../../Models/recruiterModel/jobPostsModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const profileModel = require("../../Models/candidateModel/profileModel");

const { ObjectId } = require("mongoose").Types;



const updateJobPost = async function (req, res) {
    try {
      let jobPostId = req.params.jobPostId;
          const jobPost = await JobPostModel.findOne({ _id: new ObjectId(jobPostId) });
      if (!jobPost) {
            return res.status(404).send({ message: "job post doesn't exist" });
      }
      let updatedData = { ...req.body };
  
      let updatedDoc = await JobPostModel.findByIdAndUpdate(
        jobPostId,
        updatedData,
        { new: true }
      );
      return res.status(200).send(updatedDoc);
    } catch (error) {
      console.log(error);
    }
  
  }
  module.exports = {updateJobPost}