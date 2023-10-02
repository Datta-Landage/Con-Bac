const SignUpModel = require("../Models/signUpModel");
const Admin = require("../Models/adminModel/adminModel");
const JWT = require("jsonwebtoken")

const signIn = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "Email and password are mandatory" });
    }

    // Check if the user is a candidate
    const existingUser = await SignUpModel.findOne({ email, password });

    if (existingUser) {
      return res
        .status(200)
        .send({
          message: "Logged in successfully as a user",
          data: existingUser,
        });
    }

    // Check if the user is an admin
    const existingAdmin = await Admin.findOne({ email, password });

    if (existingAdmin) {
      let role = "CONNECTING_ADMIN"
      let createJwt = JWT.sign(
        {
          id: existingAdmin._id,
          email: existingAdmin.email,
          role: role
        },
        process.env.key
      );
      req.session = {
        jwt: createJwt,
      };
  
      return res
        .status(200)
        .send({
          message: "Logged in successfully as an admin",
          data: existingAdmin,
        });
    }

    // If no matching candidate or admin found
    return res.status(404).send({ status: false, message: "User not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = { signIn };
