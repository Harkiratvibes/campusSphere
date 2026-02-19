const db = require("../config/database.js");

// Create Class
exports.createClass = async (req, res) => {
  try {
    const { name, year } = req.body;

    if (!name || !year) {
      return res.status(400).json({ message: "All fields required" });
    }

    await db.query(
      "INSERT INTO classes (name, year) VALUES (?, ?)",
      [name, year]
    );

    res.status(201).json({
      message: "Class created successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Classes
exports.getAllClasses = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM classes");

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single Class
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM classes WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Class
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year } = req.body;

    const [result] = await db.query(
      "UPDATE classes SET name = ?, year = ? WHERE id = ?",
      [name, year, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({ message: "Class updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Class
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM classes WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({ message: "Class deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// ================= SUBJECT CONTROLLERS =================

// Create Subject
exports.createSubject = async (req, res) => {
  try {
    const { name, class_id } = req.body;

    if (!name || !class_id) {
      return res.status(400).json({ message: "All fields required" });
    }

    await db.query(
      "INSERT INTO subjects (name, class_id) VALUES (?, ?)",
      [name, class_id]
    );

    res.status(201).json({
      message: "Subject created successfully",
    });

  } catch (err) {
    console.error("Create Subject Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get All Subjects (With Class Name)
exports.getAllSubjects = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        subjects.id,
        subjects.name,
        classes.name AS class_name,
        classes.year
      FROM subjects
      JOIN classes ON subjects.class_id = classes.id
    `);

    res.json(rows);

  } catch (err) {
    console.error("Get Subjects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get Single Subject By ID
exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM subjects WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("Get Subject Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Update Subject
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, class_id } = req.body;

    if (!name || !class_id) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [result] = await db.query(
      "UPDATE subjects SET name = ?, class_id = ? WHERE id = ?",
      [name, class_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ message: "Subject updated successfully" });

  } catch (err) {
    console.error("Update Subject Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete Subject
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM subjects WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ message: "Subject deleted successfully" });

  } catch (err) {
    console.error("Delete Subject Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ================= TEACHER CONTROLLERS =================

const bcrypt = require("bcrypt");

// Create Teacher (Create User + Teacher Profile)
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check email
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Get teacher role id
    const [roleData] = await db.query(
      "SELECT id FROM roles WHERE name = 'teacher'"
    );

    const role_id = roleData[0].id;

    // Insert user
    const [userResult] = await db.query(
      "INSERT INTO users (name,email,password,role_id) VALUES (?,?,?,?)",
      [name, email, hash, role_id]
    );

    const user_id = userResult.insertId;

    // Insert teacher profile
    await db.query(
      "INSERT INTO teachers (user_id, department) VALUES (?,?)",
      [user_id, department]
    );

    res.status(201).json({
      message: "Teacher created successfully",
    });

  } catch (err) {
    console.error("Create Teacher Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get All Teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        teachers.id,
        users.name,
        users.email,
        teachers.department
      FROM teachers
      JOIN users ON teachers.user_id = users.id
    `);

    res.json(rows);

  } catch (err) {
    console.error("Get Teachers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete Teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user id first
    const [rows] = await db.query(
      "SELECT user_id FROM teachers WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const user_id = rows[0].user_id;

    // Delete teacher
    await db.query("DELETE FROM teachers WHERE id = ?", [id]);

    // Delete user
    await db.query("DELETE FROM users WHERE id = ?", [user_id]);

    res.json({ message: "Teacher deleted successfully" });

  } catch (err) {
    console.error("Delete Teacher Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

