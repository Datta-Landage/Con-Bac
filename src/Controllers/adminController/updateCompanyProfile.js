const Admin = require("../../Models/adminModel/adminModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const { ObjectId } = require("mongoose").Types;


const updateCompany = async function(req,res){
    try{
        let {adminId,companyId} = req.params;
        
        const admin = await Admin.findOne({ _id: new ObjectId(adminId) });
        if (!admin) {
          return res.status(404).send({ message: "This is not an admin" });
        }
    
        const companyProfile = await CompanyProfileModel.findOne({
            companyId: companyId,
          });
      
          if (!companyProfile) {
            return res
              .status(404)
              .send({ status: false, message: "company profile not found" });
          }
          let updatedData = { ...req.body };
  
          let updatedDoc = await CompanyProfileModel.findOneAndUpdate(
            {companyId:companyId},
            updatedData,
            { new: true }
          );
          return res.status(200).send(updatedDoc);

    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update company profile." });
      }

}

module.exports = {updateCompany}