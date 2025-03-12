const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
const authRoutes = require("../routes/auth"); // تعديل المسار لأننا داخل مجلد functions
const messageRoutes = require("../routes/messages"); // تعديل المسار
const User = require("../models/user"); // تعديل المسار
const serverless = require("serverless-http"); // إضافة serverless-http

dotenv.config();
const app = express();

// توصيل MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// إعدادات الوسيط
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// إعداد الجلسات (Sessions)
// ملاحظة: Netlify Functions لا تدعم الجلسات بشكل مباشر، لذا نحتاج إلى تعديل
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // يجب استخدام مخزن خارجي للجلسات لأن Serverless Functions عديمة الحالة
    // لكن سنترك هذا مؤقتًا لاختبار الكود، وسنناقش الحل لاحقًا
    cookie: { secure: false }, // يجب أن يكون secure: true في الإنتاج مع HTTPS
  })
);

// تقديم الملفات الثابتة (لكن هذا لن يعمل مباشرة في Serverless Functions)
// بدلاً من ذلك، تعتمد Netlify على مجلد public مباشرة للملفات الثابتة
// لذا يمكنك إزالة هذا السطر لأن Netlify ستتعامل مع الملفات الثابتة تلقائيًا
// app.use(express.static("public"));

// توجيه الصفحة الرئيسية إلى تسجيل الدخول
app.get("/", (req, res) => {
  res.redirect("/auth/index");
});

// مسار الحصول على الرسائل
app.get("/profile/messages", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "غير مسموح" });
  }

  try {
    const user = await User.findById(req.session.userId);
    // ترتيب الرسائل من الأحدث إلى الأقدم
    const sortedMessages = user.messages.sort(
      (a, b) => b.timestamp - a.timestamp
    );
    res.json(sortedMessages);
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ في تحميل الرسائل" });
  }
});

// مسار الملف الشخصي
app.get("/profile", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/auth/index");
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/auth/logout");
    }
    // لا يمكن استخدام res.sendFile في Serverless Functions مباشرة
    // لأن Netlify تتعامل مع الملفات الثابتة من مجلد public
    // لذا، يمكنك إعادة توجيه المستخدم إلى الملف مباشرة
    res.redirect("/profile.html");
  } catch (error) {
    res.status(500).send("حدث خطأ");
  }
});

// مسار للحصول على بيانات المستخدم
app.get("/api/user", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("غير مسجل دخول");
  }

  try {
    const user = await User.findById(req.session.userId);
    res.json({ _id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).send("حدث خطأ");
  }
});

// مسار للحصول على اسم المستخدم
app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "المستخدم غير موجود" });
    res.json({ name: user.name });
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ" });
  }
});

// توجيهات أخرى
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

// تصدير التطبيق كـ Serverless Function
module.exports.handler = serverless(app);
