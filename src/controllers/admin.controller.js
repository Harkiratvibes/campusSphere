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

