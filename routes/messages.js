const express = require("express");
const User = require("../models/user");
const router = express.Router();

// صفحة إرسال الرسالة
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("المستخدم غير موجود");
    res.sendFile("message.html", { root: "public" });
  } catch (error) {
    res.status(500).send("حدث خطأ");
  }
});

// إرسال رسالة
router.post("/:id", async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("المستخدم غير موجود");

    user.messages.push({ content: message });
    await user.save();
    res.redirect("/auth/index");
  } catch (error) {
    res.status(500).send("حدث خطأ أثناء إرسال الرسالة");
    const express = require("express");
    const User = require("../models/user");
    const router = express.Router();

    // صفحة إرسال الرسالة
    router.get("/:id", async (req, res) => {
      try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("المستخدم غير موجود");
        res.sendFile("message.html", { root: "public" });
      } catch (error) {
        res.status(500).send("حدث خطأ");
      }
    });

    // إرسال رسالة
    router.post("/:id", async (req, res) => {
      try {
        const { message } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("المستخدم غير موجود");

        user.messages.push({ content: message });
        await user.save();
        res.redirect("/auth/index");
      } catch (error) {
        res.status(500).send("حدث خطأ أثناء إرسال الرسالة");
      }
    });

    module.exports = router;
  }
});

module.exports = router;
