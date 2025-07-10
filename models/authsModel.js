const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    username: { type: String, unique: true },
    google_id: { type: String },
    profile_image: { type: String },
    id_proof: { type: String },
    banner_image: { type: String },
    service_image: { type: String },
    resume_file: { type: String },
    description: { type: String },
    title: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    address: { type: String },
    mobile: { type: String },
    about_company: { type: String },
    otp: { type: String },
    password_otp: { type: String },
    fcm_id: { type: String },
    otpExpires: { type: Date },
    verify_otp: { type: Number, default: 0 }, // 0 = Not Verified, 1 = Mobile Verified, 2 = Email Verified
    block_status: {
      type: Number,
      default: 0, // 0 = blocked, 1 = active
    },
    account_type: {
      type: String,
      enum: ["Freelancer", "Company", "Business", "Individual"],
    },
    rating: { type: String, default: "0" },
    rating_count: { type: Number, default: "0" },
    // save_like_status: { type: String, default: "0" },
    verify_profile: { type: String, default: "false" },
    total_projects_done: { type: String, default: "0" },
    experience: { type: String, default: "0" },
    total_project_comppleted: { type: String, default: "0" },
    wallet_ammount: { type: Number, default: 0 },
    subcategoryId: [{ type: String }],
    skills: [{ type: String }],
    panNumber: { type: String },
    gstNumber: { type: String },
    panCard: { type: String },
    gstCertificate: { type: String },
    education: [
      {
        degree: String,
        institute: String,
        year: String,
      },
    ],
    language: [{ type: String }],
    emplement_history: [
      {
        company_name: String,
        role: String,
        start_date: String,
        end_date: String,
      },
    ],
    work_history: [
      {
        company: String,
        position: String,
        start_year: String,
        end_year: String,
        description: String,
      },
    ],
    links: [
      {
        type: { type: String },
        url: { type: String },
      },
    ],
    topFreelancer: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const BlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Auth = mongoose.model("users", userSchema);
const Blacklist = mongoose.model("blacklists", BlacklistSchema);
const Notification = mongoose.model("notifications", NotificationSchema);

module.exports = {
  Auth,
  Blacklist,
  Notification,
};
