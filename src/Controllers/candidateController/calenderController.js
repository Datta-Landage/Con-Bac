const calendarModel = require("../../Models/candidateModel/calenderModel");
const SignUpModel = require("../../Models/signUpModel");
const { ObjectId } = require("mongoose").Types;

// Create a new calendar event with a task
const createTask = async function (req, res) {
  try {
    const { title, dateAndTime, note, participantEmails } = req.body;
    
    const { candidateId } = req.params;
    const candidate = await calendarModel
      .findOne({
        candidateId: new ObjectId(candidateId),
      })
      .sort({ createdAt: -1 })
      .limit(1);
    
    const candidateData = await SignUpModel.findOne({_id:new ObjectId(candidateId)})

    // const abc = participantEmails.map((i)=> i.participantEmails)
    //   console.log(abc);
    // const abc = participantEmails.push(candidateData?.email)
    if (!candidate) {
      const data = await calendarModel.create({
        task: 1,
        title,
        dateAndTime,
        note,
        participantEmails,
        candidateId,
      });
 
    const abc = data?.participantEmails.push(candidateData?.email)

      await data.save()
      return res
        .status(201)
        .send({ message: "Calender event created successfully", data: data });
    } else{
      const data = await calendarModel.create({
        task: (candidate?.task)+1,
        title,
        dateAndTime,
        note,
        participantEmails,
        candidateId,
      });
      const abc = data?.participantEmails.push(candidateData?.email)
      
        await data.save()
      return res
        .status(201)
        .send({ message: "Calender event created successfully", data: data });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createTask,
};
