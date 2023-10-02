const Admin = require("../../Models/adminModel/adminModel");
const profileModel = require("../../Models/candidateModel/profileModel");
const { ObjectId } = require("mongoose").Types;


const bookmarkCandidateProfileByAdmin = async function (req, res) {
  try {
    let { adminId } = req.params; // Change to adminId instead of candidateId
    const { candidateId } = req.body;

    if (!adminId || !candidateId) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Admin ID and Candidate ID are required",
        });
    }

    // Check if the user is an admin (you might need to modify this check based on your admin authentication logic)
    let admin = await Admin.findOne({
      _id: new ObjectId(adminId),
    });

    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    // Retrieve the candidate profile
    let candidateProfile = await profileModel.findOne({
      candidateId: new ObjectId(candidateId),
    });

    if (!candidateProfile) {
      return res.status(404).send({ message: "Candidate profile not found" });
    }

    // Store the candidateId in the bookmarkedCandidates array of the admin (assuming you have an admin profile model)
    admin.bookmarkedCandidateProfiles.push(candidateProfile._id);
    const updatedAdmin = await admin.save();

    res.status(201).send({ message: "Candidate profile bookmarked successfully by admin!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};


const ShowbookmarkedCandidateProfilesByAdmin = async function (req, res) {
  try {
    let { adminId } = req.params;
    const adminProfile = await Admin.findOne({
      _id: new ObjectId(adminId),
    });

    if (!adminProfile) {
      return res
        .status(404)
        .send({ status: false, message: "Admin profile not found" });
    }

    const bookmarkedCandidateProfileIds = adminProfile.bookmarkedCandidateProfiles;

    let bookmarkedCandidateProfiles = [];
    for (let i = 0; i < bookmarkedCandidateProfileIds.length; i++) {
      let candidateProfile = await profileModel.findOne({
        _id: new ObjectId(bookmarkedCandidateProfileIds[i]),
      }); 
      bookmarkedCandidateProfiles.push(candidateProfile);
    }

    return res.status(200).send({ bookmarkedCandidateProfilesByAdmin: bookmarkedCandidateProfiles });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

  module.exports = {bookmarkCandidateProfileByAdmin,ShowbookmarkedCandidateProfilesByAdmin}