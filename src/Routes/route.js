const express = require("express");
const passport = require("passport");
const { signUp, verifyEmail } = require("../Controllers/signUpController");
const { forgotPassword } = require("../Controllers/forgotPassword");
const { signOut } = require("../Controllers/signOutController");

const {
  userProfile,
  getUserAccount,
} = require("../Controllers/userAccountController");
const { signIn } = require("../Controllers/signInController");

const {
  createProfile,
  getAllProfiles,
  getProfileById,
} = require("../Controllers/candidateController/profileController");
const {
  createTask,
} = require("../Controllers/candidateController/calenderController");
const {
  createCompanyProfile,
  getCompanyProfile,
} = require("../Controllers/recruiterController/companyController");
const {
  createJobPost,
  candidatesWhoHasAppliedToJob,
} = require("../Controllers/recruiterController/jobPostsController");
const {
  storeProfilePhoto,
} = require("../Controllers/candidateController/profilePhotoController");

// const {storeRecruiterProfilePhoto} = require("../Controllers/recruiterController/recruiterProfilePhotoController")
// const {
//   recruiterCompanyInfo,
// } = require("../Controllers/recruiterController/recruiterCompanyController");

const {
  getJob,
  getAllJobs,
} = require("../Controllers/recruiterController/getJobs");

const {
  adminProfile,
} = require("../Controllers/adminController/adminAccountController");

const {
  createAdminCompanyProfile,
} = require("../Controllers/adminController/createAdminCompanyProfile");

const { allJobs } = require("../Controllers/adminController/allJobs");
const { singleJob } = require("../Controllers/adminController/singleJob");
const {
  updateJobPost,
} = require("../Controllers/adminController/updateJobPost");
const {
  deleteJobPost,
} = require("../Controllers/adminController/deleteJobPost");
const {
  bookmarkJobForAdmin,
  bookmarkedJobsByAdminInfo,
} = require("../Controllers/adminController/bookmarkJob");
const { createJob } = require("../Controllers/adminController/createJobPost");
const {
  allCandidates,
} = require("../Controllers/adminController/allCandidates");
const {
  updateCandidateProfile,
} = require("../Controllers/adminController/updateCandidateProfile");
const {
  deleteCandidateProfile,
} = require("../Controllers/adminController/deleteCandidateProfile");
const {
  bookmarkCandidateProfileByAdmin,
  ShowbookmarkedCandidateProfilesByAdmin,
} = require("../Controllers/adminController/bookmarkCandidateProfile");
const {
  createCandidateProfile,
} = require("../Controllers/adminController/createCandidateProfile");
const {
  allCompanies,
} = require("../Controllers/adminController/allCompanyProfiles");

const {
  singleCompany,
} = require("../Controllers/adminController/singleCompanyProfile");

const {
  updateCompany,
} = require("../Controllers/adminController/updateCompanyProfile");

const {
  deleteCompanyProfile,
} = require("../Controllers/adminController/deleteCompanyProfile");

const {
  bookmarkCompanyProfileByAdmin,
  showBookmarkedCompanyProfilesByAdmin,
} = require("../Controllers/adminController/bookmarkCompanyProfile");

const {
  applyToJob,
  appliedJobsInfo,
  bookmarkJobPost,
  bookmarkedJobsInfo,
} = require("../Controllers/candidateController/applyToJob");
const { currentUser } = require("../Auth/currentUser");
const { requireAuthorization } = require("../Auth/authorization");
const { userType } = require("../userType/types");
const {
  messages,
  candidateMessage,
  recruiterMessage,
  getMessages,
  postMessage,
} = require("../Controllers/messagesController");

const router = express.Router();

// router.get("/test", async(req,res)=>{
//     return res.send("success")
// })

router.post("/signUp", signUp);

router.get("/verifyEmail", verifyEmail);

router.post("/forgotPassword", forgotPassword);

router.post("/messages/:senderId", postMessage);
router.get("/messages/:receiverId", getMessages);
router.get("/candidateMessage/:candidateId", candidateMessage);
router.get("/recruiterMessage/:recruiterId", recruiterMessage);

router.put(
  "/updateUser/:candidateId",

  userProfile
);

router.post("/signIn", signIn);

router.post("/signout", signOut);

router.post(
  "/createProfile",

  createProfile
);

router.get("/getAllProfiles", getAllProfiles);
router.get("/getProfileById/:candidateId", getProfileById);

router.get(
  "/userAccount/:userId",

  getUserAccount
);

router.post(
  "/calenderEvent/:candidateId",

  createTask
);

router.post(
  "/companyProfile/:recruiterId",

  createCompanyProfile
);

router.get(
  "/getCompanyProfile/:recruiterId",

  getCompanyProfile
);

router.post(
  "/createJob",

  createJobPost
);

router.post("/savePhoto/:candidateId", storeProfilePhoto);
// router.post("/saveRecruiterPhoto/:candidateId", storeRecruiterProfilePhoto)

// router.post("/recruiterCompanyInfo/:candidateId", recruiterCompanyInfo);
router.get("/getJob/:recruiterId", getJob);

router.get("/getAllJobs", getAllJobs);

router.post(
  "/admin",

  adminProfile
);

router.get("/allJobs/:adminId", allJobs);

router.get("/singleJob/:jobPostId", singleJob);

router.put(
  "/updateJob/:jobPostId",

  updateJobPost
);

router.delete(
  "/deleteJobPost/:jobPostId",

  deleteJobPost
);

router.put(
  "/bookmarkJobForAdmin/:adminId",

  bookmarkJobForAdmin
);

router.get(
  "/bookmarkedJobsByAdminInfo/:adminId",

  bookmarkedJobsByAdminInfo
);

router.post(
  "/createJobPost",

  createJob
);

router.get("/allCandidates/:adminId", allCandidates);

router.put(
  "/updateCandidate/:adminId/:candidateId",

  updateCandidateProfile
);

router.delete(
  "/deleteCandidate/:adminId/:candidateId",

  deleteCandidateProfile
);

router.put("/bookmarkCandidate/:adminId", bookmarkCandidateProfileByAdmin);

router.get(
  "/ShowbookmarkedCandidateProfilesByAdmin/:adminId",
  ShowbookmarkedCandidateProfilesByAdmin
);

router.post("/createCandidate/:adminId", createCandidateProfile);

router.get(
  "/allCompanies/:adminId",

  allCompanies
);
router.get("/singleCompany/:adminId/:companyId", singleCompany);

router.put("/updateCompany/:adminId/:companyId", updateCompany);

router.delete("/deleteCompany/:adminId/:companyId", deleteCompanyProfile);

router.put("/bookmarkCompany/:adminId", bookmarkCompanyProfileByAdmin);

router.get(
  "/showBookmarkedCompanyProfilesByAdmin/:adminId",
  showBookmarkedCompanyProfilesByAdmin
);

router.post("/createAdminCompany", createAdminCompanyProfile);

router.post("/jobApply/:candidateId", applyToJob);

router.get("/getAllJobs/:candidateId", appliedJobsInfo);

router.post("/bookmarkJobPost/:candidateId", bookmarkJobPost);

router.get("/bookmarkedJobs/:candidateId", bookmarkedJobsInfo);

router.get(
  "/candidatesWhoHasAppliedToJob/:jobPostId",
  candidatesWhoHasAppliedToJob
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google login callback
router.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/auth/microsoft", passport.authenticate("microsoft"));

// Microsoft login callback
router.get(
  "/api/auth/microsoft/callback",
  passport.authenticate("microsoft", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

module.exports = router;
