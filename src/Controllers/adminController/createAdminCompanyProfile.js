const Admin = require("../../Models/adminModel/adminModel");
const { ObjectId } = require("mongoose").Types;
const CompanyProfile = require("../../Models/recruiterModel/companyModel");
const shortid = require("shortid");
const { uploadFile } = require("../../awsConfigure/aws");

// Function to generate a unique company ID using shortid library
const generateUniqueId = () => {
  return shortid.generate();
};

let randomNo = Math.floor(Math.random() * 9000000000) + 1000;

// Controller logic to create a new company profile
const createAdminCompanyProfile = async (req, res) => {
  try {
    const {
      companyName,
      companyPhoto, // Assuming you have received the company photo in req.body
      domains,
      aboutCompany,
      website,
      address,
      city,
      country,
      recruiterId,
      recruiterDesignation,
    } = req.body;

    const websiteLink = await CompanyProfile.findOne({ website: website });
    if (websiteLink) {
      return res.status(400).send({
        status: false,
        message: "This company already exist in the database",
      });
    }

    // Generate a unique company ID
    const companyId = generateUniqueId();

    let files = req.files;

    if (files.length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide The company photo" });
    }

    const uploadedImage = await uploadFile(files[0]);
    // req.body.companyPhoto = uploadedImage

    // Save the company profile with the S3 photo link
    const newCompanyProfile = new CompanyProfile({
      companyId: `${domains}${randomNo}${companyId}`,
      companyName,
      companyPhoto: uploadedImage, // Save the S3 link of the uploaded photo
      domains,
      aboutCompany,
      website,
      address,
      city,
      country,
      recruiterId,
      recruiterDesignation,
    });

    const savedProfile = await newCompanyProfile.save();

    res.status(201).send(savedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create company profile." });
  }
};

module.exports = {
  createAdminCompanyProfile,
};