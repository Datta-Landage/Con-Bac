const Admin = require("../../Models/adminModel/adminModel");
const CompanyProfile = require("../../Models/recruiterModel/companyModel");
const { ObjectId } = require("mongoose").Types;

const bookmarkCompanyProfileByAdmin = async function (req, res) {
  try {
    let { adminId } = req.params;
    const { companyId } = req.body;

    if (!adminId || !companyId) {
      return res.status(400).send({
        status: false,
        message: "Admin ID and Company ID are required",
      });
    }

    // Check if the user is an admin (you might need to modify this check based on your admin authentication logic)
    let admin = await Admin.findOne({
      _id: new ObjectId(adminId),
    });

    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    // Retrieve the company profile
    let companyProfile = await CompanyProfile.findOne({
      companyId: companyId,
    });

    if (!companyProfile) {
      return res.status(404).send({ message: "Company profile not found" });
    }

    // Store the companyId in the bookmarkedCompanies array of the admin
    admin.bookmarkedCompanyProfiles.push(companyProfile.companyId);
    const updatedAdmin = await admin.save();

    res
      .status(201)
      .send({ message: "Company profile bookmarked successfully by admin!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const showBookmarkedCompanyProfilesByAdmin = async function (req, res) {
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

    const bookmarkedCompanyProfileIds = adminProfile.bookmarkedCompanyProfiles;

    let bookmarkedCompanyProfiles = [];
    for (let i = 0; i < bookmarkedCompanyProfileIds.length; i++) {
      let companyProfile = await CompanyProfile.findOne({
        companyId: bookmarkedCompanyProfileIds[i],
      });
      bookmarkedCompanyProfiles.push(companyProfile);
    }

    return res
      .status(200)
      .send({ bookmarkedCompanyProfilesByAdmin: bookmarkedCompanyProfiles });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  bookmarkCompanyProfileByAdmin,
  showBookmarkedCompanyProfilesByAdmin,
};
