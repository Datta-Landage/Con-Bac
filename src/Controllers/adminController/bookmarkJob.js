const Admin = require("../../Models/adminModel/adminModel");
const JobPostModel = require("../../Models/recruiterModel/jobPostsModel");
const { ObjectId } = require("mongoose").Types;


const bookmarkJobForAdmin = async function (req, res) {
  try {
    let { adminId } = req.params; // Change to adminId instead of candidateId
    const { jobPostId } = req.body;

    if (!adminId || !jobPostId) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Admin ID and Job Post ID are required",
        });
    }

    // Check if the user is an admin (you might need to modify this check based on your admin authentication logic)
    let admin = await Admin.findOne({
      _id: new ObjectId(adminId),
    });

    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    // Retrieve the job post
    let jobPost = await JobPostModel.findOne({
      _id: new ObjectId(jobPostId),
    });

    if (!jobPost) {
      return res.status(404).send({ message: "Job post not found" });
    }

    // Store the jobPostId in the bookmarkedJobs array of the admin (assuming you have an admin profile model)
    admin.bookmarkedJobs.push(jobPost._id);
    const updatedAdmin = await admin.save();

    res.status(201).send({ message: "Job bookmarked successfully by admin!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};



const bookmarkedJobsByAdminInfo = async function (req, res) {
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

    const bookmarkedJobIds = adminProfile.bookmarkedJobs;

    let bookmarkedJobs = [];
    for (let i = 0; i < bookmarkedJobIds.length; i++) {
      let jobDetail = await JobPostModel.findOne({
        _id: new ObjectId(bookmarkedJobIds[i]),
      }); 
      bookmarkedJobs.push(jobDetail);
    }

    return res.status(200).send({ bookmarkedJobsByAdmin: bookmarkedJobs });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};


  module.exports = {bookmarkJobForAdmin,bookmarkedJobsByAdminInfo}