const Admin = require("../../Models/adminModel/adminModel");
const CompanyProfileModel = require("../../Models/recruiterModel/companyModel");
const { ObjectId } = require("mongoose").Types;


const allCompanies = async function(req,res){
    try{
        let adminId = req.params.adminId;
        const admin = await Admin.findOne({ _id: new ObjectId(adminId) });
        if (!admin) {
          return res.status(404).send({ message: "This is not an admin" });
        }
    
        const allCompanies = await CompanyProfileModel.find()
        return res.status(200).send({allCompanies})

    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch company profiles." });
      }

}

module.exports = {allCompanies}