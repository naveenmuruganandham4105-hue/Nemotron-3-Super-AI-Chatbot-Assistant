const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, (req, res) => {

  const sql =
    "SELECT * FROM chat_history WHERE user_id = ? ORDER BY id DESC";

  db.query(
    sql,
    [req.user.id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    }
  );
});

module.exports = router;