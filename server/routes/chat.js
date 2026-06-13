const db = require("../config/db");
const express = require("express");
const axios = require("axios");
const auth = require("../middleware/auth");

const router = express.Router();


// ================= SEND MESSAGE =================
router.post("/", auth, async (req, res) => {
  try {
    const { message } = req.body;

    const userId = req.user.id;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse =
      response.data.choices[0].message.content;

    const sql =
      "INSERT INTO chat_history (user_id, user_message, ai_response) VALUES (?, ?, ?)";

    db.query(
      sql,
      [userId, message, aiResponse],
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    res.json({
      reply: aiResponse,
    });

  } catch (error) {

    console.log(
      "FULL ERROR:",
      JSON.stringify(
        error.response?.data,
        null,
        2
      )
    );

    res.status(500).json({
      message:
        error.response?.data ||
        error.message,
    });

  }
});


// ================= LOAD HISTORY =================
router.get("/history", auth, (req, res) => {

  const userId = req.user.id;

  const sql =
    "SELECT * FROM chat_history WHERE user_id = ? ORDER BY id ASC";

  db.query(sql, [userId], (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "DB Error",
      });
    }

    res.json(result);

  });

});

// ================= DELETE ALL HISTORY =================
router.delete("/history", auth, (req, res) => {

  const userId = req.user.id;

  const sql =
    "DELETE FROM chat_history WHERE user_id = ?";

  db.query(sql, [userId], (err) => {

    if (err) {
      return res.status(500).json({
        message: "Database Error",
      });
    }

    res.json({
      message: "History Deleted Successfully",
    });

  });

});


// ================= DELETE SINGLE MESSAGE =================
router.delete("/:id", auth, (req, res) => {

  const userId = req.user.id;
  const messageId = req.params.id;

  const sql =
    "DELETE FROM chat_history WHERE id = ? AND user_id = ?";

  db.query(
    sql,
    [messageId, userId],
    (err) => {

      if (err) {
        return res.status(500).json({
          message: "Database Error",
        });
      }

      res.json({
        message: "Message deleted successfully",
      });

    }
  );

});


// ================= DELETE ALL HISTORY =================
router.delete("/history", auth, (req, res) => {

  const userId = req.user.id;

  const sql =
    "DELETE FROM chat_history WHERE user_id = ?";

  db.query(sql, [userId], (err) => {

    if (err) {
      return res.status(500).json({
        message: "Database Error",
      });
    }

    res.json({
      message: "History Deleted Successfully",
    });

  });

});


module.exports = router;