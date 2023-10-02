const CompanyProfile = require("../../Models/recruiterModel/companyModel");
const SignUpModel = require("../../Models/signUpModel");
const { ObjectId } = require("mongoose").Types;

const shortid = require("shortid");
const { uploadFile } = require("../../awsConfigure/aws");

// Function to generate a unique company ID using shortid library
const generateUniqueId = () => {
  return shortid.generate()

};

// Define a default company photo URL or path
const DEFAULT_COMPANY_PHOTO_URL = "company image.png"; 

// Controller logic to create a new company profile
const createCompanyProfile = async (req, res) => {
  try {
    const {
      companyName,
      companyPhoto,
      domains,
      aboutCompany,
      website,
      address,
      city,
      country,
      recruiterDesignation
    } = req.body;

    const { recruiterId } = req.params; // Extracting only the recruiterId from params

    const recruiter = await SignUpModel.findOne({ _id: new ObjectId(recruiterId) });

    if (!recruiter) {
      return res.status(404).send({
        status: false,
        message: "Recruiter not found in the signup model",
      });
    }
    const websiteLink = await CompanyProfile.findOne({ website: website });
    if (websiteLink) {
      return res.status(400).send({
        status: false,
        message: "This company already exists in the database",
      });
    }
let randomNo = Math.floor(Math.random() * 9000000000) + 1000;


    // Generate a unique company ID
    const companyId = `${randomNo}${generateUniqueId()}`;

    let files = req.files;

    // Check if companyPhoto is provided, if not, use the default photo
    let uploadedImage = DEFAULT_COMPANY_PHOTO_URL; // Default photo URL

    if (files.length > 0) {
      // If a company photo is provided, upload it
      uploadedImage = await uploadFile(files[0]);
    }

    // Create the company profile without using save
    const newCompanyProfile = await CompanyProfile.create({
      companyId: `${domains}${companyId}`,
      companyName,
      companyPhoto: uploadedImage, // Save the S3 link of the uploaded photo or default photo URL
      domains,
      aboutCompany,
      website,
      address,
      city,
      country,
      recruiterDesignation,
      recruiterId
    });

    // Send the created company profile in the response
    res.status(201).send({
      data: newCompanyProfile,
      message: "Company profile created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create company profile." });
  }
};



const getCompanyProfile = async function(req,res){
  try{
    const { recruiterId } = req.params; // Extracting only the recruiterId from params

    const recruiter = await SignUpModel.findOne({ _id: new ObjectId(recruiterId) });

    if (!recruiter) {
      return res.status(404).send({
        status: false,
        message: "Recruiter not found in the signup model",
      });
    }


    const companyCreatedByRecruiter = await CompanyProfile.findOne({
      recruiterId:recruiterId
    });
    if (!companyCreatedByRecruiter) {
      return res.status(404).send("Company profile Not Found");
    }
    return res.status(200).send(companyCreatedByRecruiter);


  }catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch company profile." });
  }
}



module.exports = {
  createCompanyProfile,getCompanyProfile
};
