const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const JobPostModel = require("../../Models/recruiterModel/jobPostsModel");

const { ObjectId } = require("mongoose").Types;

const getJob = async function (req, res) {
  try {
    const { recruiterId } = req.params;
    if (!recruiterId) {
      return res.status(400).send({ message: "recruiterId id is required" });
    }

    const jobsCreatedByRecruiter = await JobPostModel.find({
      recruiterId,
    }).sort({ createDate: -1 });
    if (jobsCreatedByRecruiter.length == 0) {
      return res.status(404).send("Jobs Not Found");
    }
    return res.status(200).send(jobsCreatedByRecruiter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get job posts." });
  }
};

const getAllJobs = async function (req, res) {
  try {
    const jobsCreatedByRecruiters = await JobPostModel.find().sort({
      createDate: -1,
    });

    if (jobsCreatedByRecruiters.length === 0) {
      return res.status(404).send("Jobs Not Found");
    }

    return res.status(200).send(jobsCreatedByRecruiters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get job posts." });
  }
};

module.exports = { getJob, getAllJobs };
