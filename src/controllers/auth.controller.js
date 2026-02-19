const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = `
    SELECT u.*, r.name AS role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.email = ?
  `;

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });
  });
};



exports.register = async (req, res) => {
  try {
    console.log("🔥 REGISTER API HIT");

    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if email exists
    console.log("⏳ Before DB query");

    db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
          return res.status(400).json({ message: "Email already exists" });
        }
        console.log("⏳ after DB query");


        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // Insert user
        db.query(
          "INSERT INTO users (name,email,password_hash,role_id) VALUES (?,?,?,?)",
          [name, email, hash, role_id],
          (err) => {
            if (err) return res.status(500).json(err);

            res.json({ message: "User registered successfully 🔥" });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
