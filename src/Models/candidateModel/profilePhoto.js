const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;

const profilePhotoSchema = new mongoose.Schema({
  candidateId: {
    type: ObjectId,
    ref: "SignUp",
    required: true,
    trim: true,
  },
  profilePhoto: {
    type: String,
    required: true,
    trim: true,
  },
});

const ProfilePhotoModel = mongoose.model("ProfilePhoto", profilePhotoSchema);

module.exports = ProfilePhotoModel;
