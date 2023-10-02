const SignUpModel = require("../Models/signUpModel");
const nodemailer = require("nodemailer");
const forgotPassword = async function (req, res) {
  try {
    const { emailOrPhone } = req.body;
    const existingUser = await SignUpModel.findOne({
      $or: [{ phoneNumber: emailOrPhone }, { email: emailOrPhone }],
    });

    if (!existingUser) {
      return res
        .status(404)
        .send(
          "Sorry, we couldn't find your details. Please enter the valid email or phone."
        );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "jadhavrajnigandha@gmail.com",
        pass: "mrlhkpxuxrwgjnab",
      },
    });

    const mailConfigurations = {
      from: "jadhavrajnigandha@gmail.com",
      to: `${existingUser.email}`,
      subject: "Password Reset Request",
      text: `Dear ${existingUser.email},

        We received a request to reset the password for your account associated with this email address. 
        Below we have shared your details, please do not share this email with others.
        Password : ${existingUser.password}
        Email : ${existingUser.email}
        We have shared the log in link below, click on the link and log in with your credentials.
        Link : http://localhost:3000/Signin
        
        If you did not request a password reset, please ignore this email or contact our support team if you have any concerns.
        
        Thank you,
        ConnectingIds`,
    };

    await transporter.sendMail(mailConfigurations);
    return res
      .status(200)
      .send(
        "We have shared your account details on your email, kindly open your mail box."
      );
  } catch (error) {
    console.log(error);
  }
};
module.exports = { forgotPassword };
