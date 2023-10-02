const Admin = require("../../Models/adminModel/adminModel");

const adminProfile = async function (req, res) {
  try {
    const { email, password } = req.body; 

    // Check if an admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).send({ message: "Admin with this email already exists" });
    }

    // Create a new Admin document with the provided email and password
    const adminAccount = await Admin.create({ email, password });
    
    // Respond with a success message and the created admin document
    return res.status(201).send({ data: adminAccount, message: "Admin account created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = { adminProfile };
