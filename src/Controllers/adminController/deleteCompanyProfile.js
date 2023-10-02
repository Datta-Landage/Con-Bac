const Admin = require("../../Models/adminModel/adminModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const { ObjectId } = require("mongoose").Types;



const deleteCompanyProfile = async function (req, res) {
    try {
        let {adminId,companyId} = req.params;
        const admin = await Admin.findOne({ _id: new ObjectId(adminId) });
        if (!admin) {
          return res.status(404).send({ message: "This is not an admin" });
        }


        const CompanyProfile = await CompanyProfileModel.findOne({
            companyId: companyId,
          });
      
          if (!CompanyProfile) {
            return res
              .status(404)
              .send({ status: false, message: "Company profile not found" });
          }

      await CompanyProfileModel.findOneAndUpdate({companyId:companyId}, { $set: { isDeleted: true } }, { new: true });
  
      return res.status(200).send({ message: "Company Profile  deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal server error" });
    }
  };



module.exports = {deleteCompanyProfile}