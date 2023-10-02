const mongoose = require("mongoose");
const {ObjectId} = require("mongoose").Types

const calendarSchema = new mongoose.Schema({
    candidateId : {
        type : ObjectId,
        ref : "SignUp",
        required : true,
        trim : true
    },
    task : {
        type : Number,
        trim : true
    },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  dateAndTime: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
    trim: true,
  },
  participantEmails: [{
    type: String,
    trim: true,
  }]
},{timestamps:true});

// const calendarSchema = new mongoose.Schema({
//   tasks: [taskSchema],
// });

const CalendarModel = mongoose.model("Calendar", calendarSchema);

module.exports = CalendarModel;
