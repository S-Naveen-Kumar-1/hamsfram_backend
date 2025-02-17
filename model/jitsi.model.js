const mongoose = require('mongoose');
const jitsiDataSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    timeStamp: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    meetingId: {
      type: String,
      required: true,
    },
    type:{
        type: String,
        required: true,
    }
  
  });

const JitsiMeetingData = mongoose.model('jitsiMeetingData', jitsiDataSchema);

module.exports = JitsiMeetingData;