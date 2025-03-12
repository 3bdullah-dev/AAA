const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const router = express.Router();

// صفحة التسجيل
router.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "public" });
});

// معالجة التسجيل
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    // في مسار التسجيل POST /register
    if (existingUser) {
      return res.status(400).send("البريد الإلكتروني مسجل مسبقًا"); // ← تغيير هنا
    }
    const user = new User({ name, email, password });
    await user.save();
    res.redirect("/auth/index");
  } catch (error) {
    res.status(500).send("حدث خطأ أثناء التسجيل");
  }
});

// صفحة تسجيل الدخول
router.get("/index", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// معالجة تسجيل الدخول
router.post("/index", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send("بيانات الدخول غير صحيحة");
    }
    req.session.userId = user._id;
    res.redirect("/profile");
  } catch (error) {
    res.status(500).send("حدث خطأ أثناء تسجيل الدخول");
  }
});

// تسجيل الخروج
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/index");
});

module.exports = router;
