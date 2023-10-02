const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const createError = require("http-errors");
const { app, google, baseUrl, faceboook } = require("../config/keys");
 
const oAuthRegisterUser = require("../Controllers/OAuth/OAuthController")
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const { ClientApplication } = require("@azure/msal-node");

const User = require("../models/User.model");
const UserLoginMech = require("../models/UserLoginMech.model");
const ContactMech = require("../models/ContactMech.model");
const SignUpModel = require("../Models/signUpModel");
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(
  new GoogleStrategy(
    {
      clientID: google.clientID,
      clientSecret: google.clientSecret,
      // callbackURL: "/api/auth/google/callback",
      callbackURL: `${baseUrl.base_server_url}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log("Passport service callback triggered: ",accessToken, refreshToken,profile);
        const data = profile._json;
        // console.log("asdfdsafsa", data.sub);

        const fetchedUser = await SignUpModel.findOne({ OAuth: data.sub });
        if (fetchedUser) {
          console.log(fetchedUser, "kkkkks");
          let id = fetchedUser._id;
          return done(null, { id: id });
        }
        const err = await oAuthRegisterUser(data);

        if (!err) throw createError.InternalServerError("failed to save user");
        console.log(err);
        let id = err._id;

        return done(null, { id: id });

        //}
        // const userExist = await ContactMech.findOne({ contact_mech_value: data.email }).populate("user");
        // if (userExist) {
        //   return done(null, {localUser: true, ...userExist.user._doc});
        // }

        // return "okkay"
        //const err = await oAuthRegisterUser(data);

        // if (!err) throw createError.InternalServerError("failed to save user");
        // console.log(err)

        //return done(null, err);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);


// Configure Microsoft Strategy
passport.use(
  new MicrosoftStrategy(
    {
      clientID: microsoft.clientID,
      clientSecret: microsoft.clientSecret,
      callbackURL: `${baseUrl.base_server_url}/api/auth/microsoft/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // In this callback, you can handle user authentication logic
        // Access token and profile details are available here

        // Example: Assuming the email is the unique identifier
        const email = profile.emails[0].value;
        const fetchedUser = await SignUpModel.findOne({ email });

        if (fetchedUser) {
          console.log(fetchedUser, "User found");
          let id = fetchedUser._id;
          return done(null, { id: id });
        }

        // If the user doesn't exist, you can create a new user or handle it based on your requirements
        const err = await oAuthRegisterUser(profile);

        if (!err) throw createError.InternalServerError("Failed to save user");

        let id = err._id;
        return done(null, { id: id });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);









// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: faceboook.clientID,
//       clientSecret: faceboook.clientSecret,
//       callbackURL: `${baseUrl.base_server_url}/api/auth/facebook/callback`,
//       profileFields: ["emails", "id", "displayName"],
//       scope: ["email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let data = profile._json;
//         const fetchedUser = await User.findOne({ OAuth: data.id });
//         if (fetchedUser && fetchedUser.isDeleted != true) {
//           let id = fetchedUser._id;
//           return done(null, { id: id });
//         }
//         if (data?.email) {
//           const UserExist = await User.findOne({ email: data?.email });
//           if (UserExist) {
//             return done(null, { exist: true, message: "already exist" });
//           }
//         }
//         data.sub = data.id;
//         const response = await oAuthRegisterUser(data);

//         if (!response)
//           throw createError.InternalServerError("failed to save user");

//         let id = response._id;

//         return done(null, { id: id });
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );