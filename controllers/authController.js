const db = require("../models/db");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0)
      return res.status(409).json({ message: "User already exists" });

    db.query("INSERT INTO users (email) VALUES (?)", [email], (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const token = jwt.sign(
        { id: result.insertId, email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.status(201).json({ token });
    });
  });
};

exports.verify = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
    res.status(200).json({ user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
