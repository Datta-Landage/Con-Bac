const Admin = require("../../Models/adminModel/adminModel");
const SignUpModel = require("../../Models/signUpModel");
const JobPostModel = require("../../Models/recruiterModel/jobPostsModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const profileModel = require("../../Models/candidateModel/profileModel");

const { ObjectId } = require("mongoose").Types;

const allCandidates = async function(req,res){
    try{
        let adminId = req.params.adminId;
        const admin = await Admin.findOne({ _id: new ObjectId(adminId) });
        if (!admin) {
          return res.status(404).send({ message: "This is not an admin" });
        }
    
        const allCandidates = await profileModel.find()
        return res.status(200).send({allCandidates})

    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create job post." });
      }
}

module.exports = {allCandidates}