//Candidate profile update ...
const SignUpModel = require("../Models/signUpModel");
const { ObjectId } = require("mongoose").Types;
const profileModel = require("../Models/candidateModel/profileModel");

const userProfile = async function (req, res) {
  try {
    let { candidateId } = req.params;
    let updatedData = { ...req.body };
    if (!candidateId) {
      return res
        .status(400)
        .send({ status: false, message: "candidate id is required" });
    }
    let user = await SignUpModel.findOne({
      _id: new ObjectId(candidateId),
    });
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }

    if (user.accountType == "Candidate") {
      if (
        !updatedData.firstName ||
        !updatedData.lastName ||
        !updatedData.phoneNumber ||
        !updatedData.addressLine1 ||
        !updatedData.addressLine2 ||
        !updatedData.country ||
        !updatedData.city ||
        !updatedData.postalCode
      ) {
        return res
          .status(400)
          .send({ status: false, message: "Fields marked with * are mandatory" });
      }
    } else if (user.accountType == "Recruiter") {
      if (
        !updatedData.firstName ||
        !updatedData.lastName ||
        !updatedData.phoneNumber ||
        !updatedData.country ||
        !updatedData.city
      ) {
        return res.status(400).send({message: "Fields marked with * are mandatory"});
      }
    }

    // Update the candidate's profile if it exists, and only update the name field
    let candidateProfile = await profileModel.findOne({
      candidateId: new ObjectId(candidateId),
    });

    if (candidateProfile) {
      // If the profile exists, update the name field
      candidateProfile.name = updatedData?.firstName + " " + updatedData?.lastName;
      await candidateProfile.save();
    }

    let updatedDoc = await SignUpModel.findByIdAndUpdate(
      candidateId,
      updatedData,
      { new: true }
    );

    return res.status(200).send({ data: updatedDoc, message: "user account updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getUserAccount = async function (req, res) {
  try {
    let { userId } = req.params;
    let userAccount = await SignUpModel.findById(userId);
    if (!userAccount) {
      return res.status(404).send("User Account not found");
    }

    return res.status(200).send(userAccount);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = { userProfile, getUserAccount };
