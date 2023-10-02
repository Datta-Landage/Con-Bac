const SignUpModel = require("../Models/signUpModel");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const signUp = async function (req, res) {
  try {
    let data = req.body;
    const { email, password, repassword, accountType } = data;
    // console.log("accTyp", accountType);
    if ((!email || !password || !accountType, !repassword)) {
      return res
        .status(400)
        .send({ status: false, message: "All fields are required" });
    }
    const isEmailExist = await SignUpModel.findOne({ email: email });
    if (isEmailExist) {
      return res.status(400).send({ message: "email already exist" });
    }

    if (repassword != password) {
      return res
        .status(400)
        .send({ status: false, message: "password is not matching" });
    }
    if (!["Recruiter", "Candidate"].includes(accountType)) {
      return res
        .status(400)
        .send({ status: false, message: "please select account type" });
    }

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

    const Tokens = JWT.sign(
      {
        data: { email, password, accountType },
      },
      process.env.key,
      { expiresIn: "3m" }
    );
    const mailConfigurations = {
      from: process.env.email,
      to: `${email}`,
      subject: "Email Verification",
      text: `Hi There!, You have recently visited our website and entered your email. Please follow the given link to verify your email: http://localhost:4000/verifyEmail?token=${Tokens}`,
    };

    let role;
    if (accountType == "Recruiter") {
      role = "CONNECTING_RECRUITER";
    }
    if (accountType == "Candidate") {
      role = "CONNECTING_CANDIDATE";
    }
    let createJwt = JWT.sign(
      {
        email: email,
        password: password,
        accountType: accountType,
        role: role,
      },
      process.env.key
    );
    req.session = {
      jwt: createJwt,
    };
    await transporter.sendMail(mailConfigurations);
    let { token } = req.query;

    if (!token) {
      return res.status(200).send({
        message:
          "Please verify your email through your gmail account, please open your mail box for that!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Verifying the JWT token
    JWT.verify(token, process.env.key, async function (err, decoded) {
      if (err) {
        console.log(err);
        return res
          .status(401)
          .send(
            "Email verification failed. Possibly the link is invalid or expired"
          );
      } else {
        let userData = decoded.data;

        let candidateData = new SignUpModel({
          email: userData.email,
          password: userData.password,
          accountType: userData.accountType,
        });
        let savedUser = await candidateData.save();

        return res.status(302).redirect("http://localhost:3000/Signin");
      }
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { signUp, verifyEmail };
// better configuration, better maintainace, better management : docker & kubernetes
// CICD = Continuous integration continuous delivery
// Min 8 gb ram - max 16 gb, 1 gb ssd, 10th or 11th generation, intel i5 processor
