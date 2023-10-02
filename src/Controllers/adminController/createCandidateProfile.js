const Admin = require("../../Models/adminModel/adminModel");
const SignUpModel = require("../../Models/signUpModel");
const JobPostModel = require("../../Models/recruiterModel/jobPostsModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const profileModel = require("../../Models/candidateModel/profileModel");

const { ObjectId } = require("mongoose").Types;
const shortid = require("shortid");

let generateUniqueId = () => {
  return shortid.generate();
};
let randomNo = Math.floor(Math.random() * 9000000000) + 1000;


const createCandidateProfile = async function (req, res) {
    try {
        let {adminId} = req.params;
        const admin = await Admin.findById(adminId);
        if (!admin) {
          return res.status(404).send({ message: "This is not an admin" });
        }
      let data = req.body;
    let ID = `CON${randomNo}${generateUniqueId()}`;

      const {
        candidateId,
        name,
        prefferedRole,
        yearsOfExperience,
        summary,
        workHistory,
        educationHistory,
        projects,
        skills,
        toolsAndTechnology,
      } = data;
  
      // const profilePhoto = req.files[0]
      if (
        !candidateId ||
        !prefferedRole ||
        !yearsOfExperience ||
        !summary ||
        !workHistory ||
        !educationHistory ||
        !projects ||
        !skills ||
        !toolsAndTechnology
      ) {
        return res
          .status(400)
          .send({ status: false, message: "All the fields are mandatory" });
      }
      const candidate = await SignUpModel.findOne({
        _id: new ObjectId(candidateId),
      });
      if (!candidate) {
        return res.status(404).send({ message: "candidate not found" });
      }
  
      //    let files = req.files
  
      //    if (files.length === 0) {
      //        return res.status(400).send({ status: false, message: "Please Provide The profile photo" });
      //    }
  
      //    const uploadedImage = await uploadFile(files[0])
  
      if (candidate.accountType != "Candidate") {
        return res
          .status(400)
          .send({ message: "Only candidates can create this profile" });
      }
  
      const newProfile = new profileModel({
        uniqueId: ID,
        candidateId,
        // profilePhoto:uploadedImage,
        name: candidate?.firstName + " " + candidate?.lastName,
        prefferedRole,
        yearsOfExperience,
        summary,
        workHistory,
        educationHistory,
        projects,
        skills,
        toolsAndTechnology,
      });
      const savedProfile = await newProfile.save();
      res.status(201).send(savedProfile);
    } catch (error) {
      console.log(error);
    }
  };


module.exports = {createCandidateProfile}