const JitsiMeetingData=require('../model/jitsi.model');

// Function to handle meeting join event
const joinMeeting = async (req, res) => {
    try {
        console.log("Webhook received PARTICIPANT_JOINED:", req.body);
        const { eventType, timestamp, data,sessionId } = req.body;

        if (eventType === "PARTICIPANT_JOINED") {
            const newEntry = new JitsiMeetingData({
                name: data.name,
                timeStamp: timestamp,
                time: new Date(timestamp).toISOString(),
                meetingId: sessionId,
                type:eventType
            });

            await newEntry.save();
            // console.log("Participant joined data saved:", newEntry);
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error("Error handling join event:", error);
        res.status(500).send("Error processing event");
    }
};

// Function to handle meeting leave event
const leaveMeeting = async (req, res) => {
    try {
        console.log("Webhook received PARTICIPANT_LEFT:", req.body);
        const { eventType, timestamp, data,sessionId } = req.body;

        if (eventType === "PARTICIPANT_LEFT") {
            const newEntry = new JitsiMeetingData({
                name: data.name,
                timeStamp: timestamp,
                time: new Date(timestamp).toISOString(),
                meetingId: sessionId,
                type:eventType
            });

            await newEntry.save();
            // console.log("Participant joined data saved:", newEntry);
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error("Error handling leave event:", error);
        res.status(500).send("Error processing event");
    }
};

const roomCreated = async (req, res) => {
    try {
        console.log("Webhook received: roomCreated", req.body);
        const { eventType, timestamp, data,sessionId } = req.body;

        if (eventType === "PARTICIPANT_LEFT") {
            const newEntry = new JitsiMeetingData({
                name: data.name,
                timeStamp: timestamp,
                time: new Date(timestamp).toISOString(),
                meetingId: sessionId,
                type:eventType
            });

            await newEntry.save();
            console.log("Participant joined data saved:", newEntry);
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error("Error handling leave event:", error);
        res.status(500).send("Error processing event");
    }
};
const roomDestroyed = async (req, res) => {
    try {
        console.log("Webhook received: roomDestroyed", req.body);
        const { eventType, timestamp, data,sessionId } = req.body;

        if (eventType === "PARTICIPANT_LEFT") {
            const newEntry = new JitsiMeetingData({
                name: data.name,
                timeStamp: timestamp,
                time: new Date(timestamp).toISOString(),
                meetingId: sessionId,
                type:eventType
            });

            await newEntry.save();
            console.log("Participant joined data saved:", newEntry);
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error("Error handling leave event:", error);
        res.status(500).send("Error processing event");
    }
};
const testAPi=async (req,res)=>{
    console.log(req.body)
}
module.exports = { joinMeeting, leaveMeeting,testAPi,roomCreated,roomDestroyed };
