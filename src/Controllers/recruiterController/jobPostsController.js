const profileModel = require("../../Models/candidateModel/profileModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const JobPostModel = require("../../Models/recruiterModel/jobPostsModel");
const SignUpModel = require("../../Models/signUpModel");
const nodemailer = require("nodemailer")
const { ObjectId } = require("mongoose").Types;

// Controller logic to create a new job post
const createJobPost = async (req, res) => {
  try {
    const {
      recruiterId,
      jobTitle,
      summary,
      yearsOfExperience,
      salaryPackage,
      location,
      modeOfWork,
      typeOfEmployment,
      description,
      skillsAndTools,
      companyId,
    } = req.body;

    let Recruiter = await SignUpModel.findById(recruiterId);
    // Check if the company profile exists in the CompanyProfile collection
    const companyProfile = await CompanyProfileModel.findOne({
      companyId: companyId,
    });
    if (!companyProfile) {
      return res.status(404).json({ error: "Company profile not found." });
    }

    let companyLogo = companyProfile.companyPhoto;

    const newJobPost = new JobPostModel({
      recruiterId,
      jobTitle,
      summary,
      yearsOfExperience,
      salaryPackage,
      location,
      modeOfWork,
      typeOfEmployment,
      description,
      skillsAndTools,
      companyId: companyProfile.companyId, // Save the companyId from the found company profile
      companyLogo,
      companySummary: companyProfile.aboutCompany, // Save the company summary from the found company profile
    });

    const savedJobPost = await newJobPost.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });

   
    const mailConfigurations = {
      from: process.env.email,
      to: `${Recruiter.email}`,
      subject: "New Job Post",
      text: `Hi There!, You have recently visited our website and successfully created a job post. Job post link: http://localhost:3000/jobs`,
    };

    await transporter.sendMail(mailConfigurations);
    res
      .status(201)
      .send({ data: savedJobPost, message: "Job post added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create job post." });
  }
};

const candidatesWhoHasAppliedToJob = async function (req, res) {
  try {
    let jobPostId = req.params.jobPostId;
    const jobPost = await JobPostModel.findOne({
      _id: new ObjectId(jobPostId),
    });
    if (!jobPost) {
      return res.status(404).send({ message: "job post doesn't exist" });
    }

    const candidates = await profileModel.find({
      jobsAppliedByCandidate: { $in: [jobPostId] },
    });

    return res.status(200).send(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch candidates." });
  }
};

module.exports = {
  createJobPost,
  candidatesWhoHasAppliedToJob,
};
