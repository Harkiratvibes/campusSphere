const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/* ================= REGISTER ================= */

exports.register = async (req, res) => {
  try {

    console.log("🔥 REGISTER API HIT");

    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    console.log("⏳ Checking email...");

    // Check if email exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    console.log("✅ Email OK");

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    console.log("🔐 Password hashed");

    // Insert user
    await db.query(
      "INSERT INTO users (name,email,password_hash,role_id) VALUES (?,?,?,?)",
      [name, email, hash, role_id]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully 🔥"
    });

  } catch (err) {

    console.error("Register Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  try {

    console.log("🔥 LOGIN API HIT");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const sql = `
      SELECT u.*, r.name AS role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `;

    console.log("⏳ Fetching user...");

    const [rows] = await db.query(sql, [email]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email"
      });
    }

    const user = rows[0];

    console.log("✅ User found");

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Wrong password"
      });
    }

    console.log("🔓 Password matched");

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {

    console.error("Login Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
