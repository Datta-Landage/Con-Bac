const Admin = require("../../Models/adminModel/adminModel");
const SignUpModel = require("../../Models/signUpModel");
const JobPostModel = require("../../Models/recruiterModel/jobPostsModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const profileModel = require("../../Models/candidateModel/profileModel");

const { ObjectId } = require("mongoose").Types;



const updateCandidateProfile = async function (req, res) {
    try {
        let {adminId,candidateId} = req.params;
        const admin = await Admin.findOne({ _id: new ObjectId(adminId) });
        if (!admin) {
          return res.status(404).send({ message: "This is not an admin" });
        }


        const candidateProfile = await profileModel.findOne({
            candidateId: new ObjectId(candidateId),
          });
      
          if (!candidateProfile) {
            return res
              .status(404)
              .send({ status: false, message: "candidate profile not found" });
          }

          
      let updatedData = { ...req.body };
  
      let updatedDoc = await profileModel.findOneAndUpdate(
        {candidateId:candidateId},
        updatedData,
        { new: true }
      );
      return res.status(200).send(updatedDoc);
    } catch (error) {
      console.log(error);
    }
  
  }

  module.exports = {updateCandidateProfile}