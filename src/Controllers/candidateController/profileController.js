const profileModel = require("../../Models/candidateModel/profileModel");
const SignUpModel = require("../../Models/signUpModel");
const { ObjectId } = require("mongoose").Types;
const shortid = require("shortid");

// const { uploadFile } = require("../../awsConfigure/aws");

let generateUniqueId = () => {
  return shortid.generate();
};

const createProfile = async function (req, res) {
  try {
    let randomNo = Math.floor(Math.random() * 9000000000) + 1000;

    let ID = `CON${randomNo}${generateUniqueId()}`;
    let data = req.body;
    const {
      candidateId,
      name,
      prefferedRole,
      yearsOfExperience,
      summary,
      workHistory,
      educationHistory,
      projects,
      softSkills,
      domainSkills,
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
      !softSkills ||
      !domainSkills ||
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
      country: candidate.country,
      city: candidate.city,
      prefferedRole,
      yearsOfExperience,
      summary,
      workHistory,
      educationHistory,
      projects,
      softSkills,
      domainSkills,
      toolsAndTechnology,
      profilePhoto: candidate.profilePhoto,
    });
    const savedProfile = await newProfile.save();
    res.status(201).send(savedProfile);
  } catch (error) {
    console.log(error);
  }
};

const getAllProfiles = async function (req, res) {
  try {
    const profiles = await profileModel.find({});
    res.status(200).send(profiles);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const getProfileById = async function (req, res) {
  try {
    const candidateId = req.params.candidateId;
    const profile = await profileModel.findOne({ candidateId });
    if (!profile) {
      return res.status(404).send({ message: "Profile not found" });
    }
    res.status(200).send(profile);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { createProfile, getAllProfiles, getProfileById };
