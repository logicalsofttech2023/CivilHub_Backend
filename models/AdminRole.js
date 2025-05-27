const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

// 🔐 Secret key (use env in production)

const AdminLoginSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String, required: true }, // this will now be encrypted
    role: { type: mongoose.Schema.Types.ObjectId, ref: "adminRoles" },
    permissions: [{ type: String, default: [] }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 🔐 Encrypt password before save
AdminLoginSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  try {
    const encrypted = CryptoJS.AES.encrypt(this.password, process.env.SECRET_KEY).toString();
    this.password = encrypted;
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Decrypt password method for admin display
AdminLoginSchema.methods.getDecryptedPassword = function () {
  try {
    const bytes = CryptoJS.AES.decrypt(this.password, process.env.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    return null;
  }
};

const AdminRole = new mongoose.Schema(
  {
    role: { type: String },
  },
  { timestamps: true }
);

const subAdmins = mongoose.model("subAdmins", AdminLoginSchema);
const adminRoles = mongoose.model("adminRoles", AdminRole);

module.exports = { subAdmins, adminRoles };
