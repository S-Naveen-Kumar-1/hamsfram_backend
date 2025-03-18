const express = require("express")
const app = express()
const http = require('http');
const cors = require("cors")
const connect = require("./config/db"); 
const Router = require("./routes/routes");
app.use(express.json())
app.use(cors())

app.use(express.json());
const server = http.createServer(app);
app.use("/", Router);

app.get('/', (req, res) => {
    res.send('Running Hamsafran server');
  });
require('dotenv').config()
const port = 8000;



// Function to send FCM notification
async function sendNotification(deviceToken) {
  const message = {
    token: deviceToken,
    notification: {
      title: "Test Notification",
      body: "Hello from Firebase!",
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent successfully:", response);
  } catch (error) {
    console.error("❌ Error sending notification:", error);
  }
}



server.listen(port, async () => {

    try {
        await connect()
        console.log("connected to db")
        console.log(`server running in port ${port}`)
    }
    catch (err) {
        console.log(err)
    }
})