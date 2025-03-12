const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // إضافة حقل الاسم
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  messages: [
    {
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
