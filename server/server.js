const chatRoutes = require("./routes/chat");
const historyRoutes = require("./routes/history");
const auth = require("./middleware/auth");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

require("./config/db");

const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
  res.send("AI Chatbot Backend Running");
});

app.get("/profile", auth, (req, res) => {
  res.json({
    message: "Welcome User",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});