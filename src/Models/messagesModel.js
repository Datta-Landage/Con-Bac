const mongoose = require("mongoose");
const SignUpModel = require("./signUpModel");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  repliedId: {
    type: String,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
