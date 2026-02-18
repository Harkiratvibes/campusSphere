const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// Only admin can access
router.get("/dashboard", auth, role(["admin"]), (req, res) => {
  res.json({
    message: "Welcome Admin 😤🔥",
    user: req.user
  });
});
const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controllers/admin.controller");

// Classes APIs (Admin Only)

router.post("/classes", auth, role(["admin"]), createClass);

router.get("/classes", auth, role(["admin"]), getAllClasses);

router.get("/classes/:id", auth, role(["admin"]), getClassById);

router.put("/classes/:id", auth, role(["admin"]), updateClass);

router.delete("/classes/:id", auth, role(["admin"]), deleteClass);


module.exports = router;
