const JitsiMeetingData=require('../model/jitsi.model');

// Function to handle meeting join event
const joinMeeting = async (req, res) => {
    try {
        console.log("Webhook received:", req.body);
        const { eventType, timestamp, data } = req.body;

        if (eventType === "PARTICIPANT_JOINED") {
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
        console.error("Error handling join event:", error);
        res.status(500).send("Error processing event");
    }
};

// Function to handle meeting leave event
const leaveMeeting = async (req, res) => {
    try {
        console.log("Webhook received:", req.body);
        const { eventType, timestamp, data } = req.body;

        if (eventType === "PARTICIPANT_LEFT") {
            await JitsiMeetingData.findOneAndUpdate(
                { name: data.name, meetingId: sessionId},
                { $set: { leaveTimeStamp: new Date(timestamp).toISOString(), leaveTime: timestamp,type:eventType } },
                { new: true }
            );
            console.log(`Participant left: ${data.name}`);
        }

        res.status(200).send("OK");
    } catch (error) {
        console.error("Error handling leave event:", error);
        res.status(500).send("Error processing event");
    }
};

module.exports = { joinMeeting, leaveMeeting };
