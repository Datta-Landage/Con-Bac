const messageModel = require("../Models/messagesModel");
const SignUpModel = require("../Models/signUpModel");
const { ObjectId } = require("mongoose").Types;

const messages = async function (req, res) {
  try {
    const { senderId } = req.params;
    const { receiverId, message } = req.body;

    const sender = await SignUpModel.findOne({ _id: new ObjectId(senderId) });
    if (!sender) {
      return res.status(404).send("User not found");
    }
    if (sender.accountType != "Recruiter") {
      return res.status(400).send("Only Recruiters can start the conversation");
    }

    const Receiver = await SignUpModel.findOne({
      _id: new ObjectId(receiverId),
    });
    if (!Receiver) {
      return res.status(404).send("User not found");
    }
    if (Receiver.accountType != "Candidate") {
      return res.status(400).send("Candidate should be the Receiver");
    }
    const messageObj = new messageModel({
      senderId,
      receiverId,
      senderName: sender?.firstName + " " + sender?.lastName,
      receiverName: Receiver?.firstName + " " + Receiver?.lastName,
      message,
    });
    const saveMessage = await messageObj.save();
    return res.status(201).send(saveMessage);
  } catch (error) {
    console.log(error);
  }
};

const candidateMessage = async function (req, res) {
  try {
    const { candidateId } = req.params;
    const candidateMessage = await messageModel.find({ receiverId: candidateId });
    
    const messagesToSend = candidateMessage.map((message) => ({
      senderId: message.senderId,
      receiverId: message.receiverId,
      senderName: message.senderName,
      receiverName: message.receiverName,
      message: message.message,
      repliedId: message._id,
      seen:message.seen,
      timestamp:message.timestamp
    }));

    return res.status(200).json(messagesToSend); // Send the messages as JSON array
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};


const recruiterMessage = async function (req, res) {
  try {
    const { recruiterId } = req.params;
    const recruiterMessages = await messageModel.find({ senderId: recruiterId });

    // Create an array of message objects to send as response
    const messagesToSend = recruiterMessages.map((message) => ({
      senderId: message.senderId,
      receiverId: message.receiverId,
      senderName: message.senderName,
      receiverName: message.receiverName,
      message: message.message,
      repliedId: message._id,
      seen:message.seen,
      timestamp:message.timestamp
    }));
    return res.status(200).json(messagesToSend); // Send the messages as JSON array
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 * Retrieves messages for a given receiverId, groups them by senderId and calculates unseen messages.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * 
 * @returns {Object} - JSON response with grouped messages
 */
const getMessages = async function (req, res) {
  try {
    const { receiverId } = req.params;

    // Fetching sended and received messages for the given receiverId
    const sendedMessages = await messageModel.find({ receiverId });
    const receivedMessages = await messageModel.find({ senderId: receiverId });

    // Combining and sorting the messages by timestamp
    const allMessages = sendedMessages
      .concat(receivedMessages)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Grouping messages by senderId
    let groupedBySenderId = allMessages.reduce((acc, message) => {
      const key = message.senderId === receiverId ? message.receiverId : message.senderId;
      const senderName = message.senderId === receiverId ? message.receiverName : message.senderName;
      if (!acc[key]) {
        acc[key] = { messages: [], senderName: senderName };
      }
      acc[key].messages.push(message);
      return acc;
    }, {});

    // Filter out sender groups with no messages
    groupedBySenderId = Object.entries(groupedBySenderId)
      .filter(([_, value]) => value.messages.length > 0)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    // Calculate unseen messages for each sender group
    for (const value of Object.values(groupedBySenderId)) {
      let unseenMessages = 0;
      let lastUnseenMessageId = null;
      for (let i = value.messages.length - 1; i >= 0; i--) {
        if (!value.messages[i].seen) {
          unseenMessages++;
          lastUnseenMessageId = value.messages[i]._id;
        } else {
          break;
        }
      }
      value["unseenMessages"] = unseenMessages;
      value["lastUnseenMessageId"] = lastUnseenMessageId;
    }


    return res.status(200).json(groupedBySenderId);
  } catch (error) {
    console.error(error); // Changed from console.log for better logging
    return res.status(500).json({ error: "Internal Server Error" }); // Provide a response in case of errors
  }
};

const postMessage = async function (req, res) {
  try {
    const { senderId } = req.params;
    const { receiverId, message, repliedId } = req.body;

    const sender = await SignUpModel.findOne({ _id: new ObjectId(senderId) });
    if (!sender) {
      return res.status(404).send("Sender User not found");
    }
    const Receiver = await SignUpModel.findOne({
      _id: new ObjectId(receiverId),
    });
    if (!Receiver) {
      return res.status(404).send("Receiver User not found");
    }
    const messageObj = new messageModel({
      senderId,
      receiverId,
      senderName: sender?.firstName + " " + sender?.lastName,
      receiverName: Receiver?.firstName + " " + Receiver?.lastName,
      message,
      repliedId,
    });
    const saveMessage = await messageObj.save();
    return res.status(201).send(saveMessage);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { messages, getMessages, postMessage, candidateMessage, recruiterMessage };
