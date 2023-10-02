const profileModel = require("../../Models/candidateModel/profileModel");
const JobPostModel = require("../../Models/recruiterModel/jobPostsModel");
const SignUpModel = require("../../Models/signUpModel");

const { ObjectId } = require("mongoose").Types;

const applyToJob = async function (req, res) {
  try {
    let { candidateId } = req.params;
    const { jobPostId } = req.body;

    if (!candidateId || !jobPostId) {
      return res
        .status(400)
        .send({
          status: false,
          message: "candidate id and jobPostId are required",
        });
    }

    let user = await SignUpModel.findOne({
      _id: new ObjectId(candidateId),
    });

    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }

    if (user.accountType !== "Candidate") {
      return res
        .status(400)
        .send({ message: "Only candidates can apply to job" });
    }

    const candidateProfileDoc = await profileModel.findOne({
      candidateId: new ObjectId(candidateId),
    });

    if (!candidateProfileDoc) {
      return res
        .status(404)
        .send({ status: false, message: "candidate profile not found" });
    }

    let jobPost = await JobPostModel.findOne({
      _id: new ObjectId(jobPostId),
    });

    if (!jobPost) {
      return res.status(404).send({ message: "jobPost not found" });
    }

    if (jobPost.status !== "Open") {
      return res.status(400).send({ message: "job application closed!" });
    }

    // Store only the jobPostId in the jobsAppliedByCandidate array
    candidateProfileDoc.jobsAppliedByCandidate.push(jobPost._id);
    const updatedDoc = await candidateProfileDoc.save();

    res.status(201).send({ message: "job Applied Successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const appliedJobsInfo = async function (req, res) {
  try {
    let { candidateId } = req.params;
    const candidateProfile = await profileModel.findOne({
      candidateId: new ObjectId(candidateId),
    });

    if (!candidateProfile) {
      return res
        .status(404)
        .send({ status: false, message: "candidate profile not found" });
    }

    const jobsInfo = candidateProfile.jobsAppliedByCandidate;

    let jobsApplied = [];
    for (let i = 0; i < jobsInfo.length; i++) {
      let jobDetail = await JobPostModel.findOne({ _id: jobsInfo[i] }); // Use await here to wait for the result
      jobsApplied.push(jobDetail);
    }

    return res.status(200).send({ jobsAppliedByCandidate: jobsApplied });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const bookmarkJobPost = async function (req, res) {
  try {
    let { candidateId } = req.params;
    const { jobPostId } = req.body;

    if (!candidateId || !jobPostId) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Candidate ID and Job Post ID are required",
        });
    }

    let user = await SignUpModel.findOne({
      _id: new ObjectId(candidateId),
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const candidateProfileDoc = await profileModel.findOne({
      candidateId: new ObjectId(candidateId),
    });

    if (!candidateProfileDoc) {
      return res
        .status(404)
        .send({ status: false, message: "Candidate profile not found" });
    }

    let jobPost = await JobPostModel.findOne({
      _id: new ObjectId(jobPostId),
    });

    if (!jobPost) {
      return res.status(404).send({ message: "Job post not found" });
    }

    // Store the jobPostId in the bookmarkedJobs array
    candidateProfileDoc.bookmarkedJobs.push(jobPost._id);
    const updatedDoc = await candidateProfileDoc.save();

    res.status(201).send({ message: "Job bookmarked successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const bookmarkedJobsInfo = async function (req, res) {
  try {
    let { candidateId } = req.params;
    const candidateProfile = await profileModel.findOne({
      candidateId: new ObjectId(candidateId),
    });

    if (!candidateProfile) {
      return res
        .status(404)
        .send({ status: false, message: "Candidate profile not found" });
    }

    const bookmarkedJobIds = candidateProfile.bookmarkedJobs;

    let bookmarkedJobs = [];
    for (let i = 0; i < bookmarkedJobIds.length; i++) {
      let jobDetail = await JobPostModel.findOne({ _id: new ObjectId(bookmarkedJobIds[i]) }); // Use await here to wait for the result
      bookmarkedJobs.push(jobDetail);
    }

    return res.status(200).send({ bookmarkedJobsByCandidate: bookmarkedJobs });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  applyToJob,
  appliedJobsInfo,
  bookmarkJobPost,
  bookmarkedJobsInfo,
};
