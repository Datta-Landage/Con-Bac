const Admin = require("../../Models/adminModel/adminModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const { ObjectId } = require("mongoose").Types;


const singleCompany = async function(req,res){
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
    
        return res.status(200).send({companyProfile})

    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch company profiles." });
      }

}

module.exports = {singleCompany}