const Admin = require("../../Models/adminModel/adminModel");
const SignUpModel = require("../../Models/signUpModel");
const JobPostModel = require("../../Models/recruiterModel/jobPostsModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const profileModel = require("../../Models/candidateModel/profileModel");

const { ObjectId } = require("mongoose").Types;

const allJobs = async function(req,res){
    try{
    let adminId = req.params.adminId;
    const admin = await Admin.findOne({ _id: new ObjectId(adminId) });
    if (!admin) {
      return res.status(400).send({ message: "This is not an admin" });
    }

    const allJobs = await JobPostModel.find()
    return res.status(200).send({allJobs})
    }catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = {allJobs}