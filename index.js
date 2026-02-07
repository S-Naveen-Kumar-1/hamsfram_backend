require("dotenv").config(); // 👈 MUST BE FIRST

const express = require("express");
const http = require("http");
const cors = require("cors");

const connect = require("./config/db");
const Router = require("./routes/routes");

const app = express();
const server = http.createServer(app);

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/", Router);

// HEALTH CHECK (VERY IMPORTANT FOR RENDER)
app.get("/", (req, res) => {
  res.send("Hamsafran server is running 🚀");
});

// ✅ USE RENDER PORT
const PORT = process.env.PORT || 8000;

// START SERVER ONLY AFTER DB CONNECTS
connect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });
