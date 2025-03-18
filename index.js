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
const { GoogleAuth } = require("google-auth-library");
const admin = require("firebase-admin");

// Load Firebase service account JSON
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to get an Access Token
async function getAccessToken() {
  try {
    const auth = new GoogleAuth({
      keyFile: "./serviceAccountKey.json", // Replace with actual path
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();
    console.log("✅ Access Token:", token.token);
    return token.token;
  } catch (error) {
    console.error("❌ Error getting Access Token:", error);
  }
}

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

// Replace with an actual FCM device token from your mobile app
const testDeviceToken =
  "cZdUU4kTWEfsmfBvHW76v4:APA91bFFDoFsdi8tKLmnNgCrfWbFCH9K4ohgZU02HHgkrBljcq6LAvjNX81PNV7dAgQi_ImAVdSzIJkRsRLTZq7WzfY_JIAhR55krKoJM2UYStm4UVIfMA0";

// Run the tests
(async () => {
  await getAccessToken(); // Fetch Access Token (optional)
  await sendNotification(testDeviceToken); // Send Notification
})();

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