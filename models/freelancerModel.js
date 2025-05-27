const mongoose = require('mongoose');

const freelancerFourtfoiloadd = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  name: { type: String, required: true },
  about_project: { type: String },
  skills: [{ type: String }],
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const BidfreelancerSchema = new mongoose.Schema({
  projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  amount: Number,
  status: { type: String, default: "Pending" } 
});

const JobApplySchema = new mongoose.Schema({
 JobID: { type: mongoose.Schema.Types.ObjectId,ref: 'postsjobs' },
 FreelancerID: { type: mongoose.Schema.Types.ObjectId, required: true,ref: 'users' },
 cover_letter: { type: String }, 
 application_status: { 
     type: String, 
     enum: ["Pending", "Active", "Declined"], 
     default: "Pending" 
 },
 fileattach_apply: { type: String, default: null }
}, { timestamps: true });

const ProjectApplySchema = new mongoose.Schema({
  projectID: { type: mongoose.Schema.Types.ObjectId,ref: 'projects' },
  FreelancerID: { type: mongoose.Schema.Types.ObjectId, required: true,ref: 'users' },
  rate: { type: String, required: true }, 
  cover_letter: { type: String }, 
  application_status: { 
      type: String, 
      enum: ["Pending", "Active", "Declined"], 
      default: "Pending" 
  },
  fileattach_apply: { type: String, default: null }
 }, { timestamps: true });

 const freelancerFavoriteJobSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "postsjobs",
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const freelancerFavoriteprojectSchema = new mongoose.Schema({
  projectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const freelancerTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  title: { type: String, required: false },
  ammount: { type: Number, required: false },
  type: { type: String, required: false }, 
  transaction_status: { type: String, required: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const freeFourtFolio = mongoose.model('freelancer_fortfolios', freelancerFourtfoiloadd);
const Bid = mongoose.model('freelancer_bids', BidfreelancerSchema);
const Apply = mongoose.model('freelancer_apply_jobs', JobApplySchema);
const Apply_Project = mongoose.model('freelancer_apply_projects', ProjectApplySchema);
const Job_Favorite = mongoose.model('freelancer_job_favorites', freelancerFavoriteJobSchema);
const Project_Favorite = mongoose.model('freelancer_projects_favorites', freelancerFavoriteprojectSchema);
const Transaction_Report = mongoose.model('freelancer_transaction_report', freelancerTransactionSchema);

module.exports = {
    freeFourtFolio,
    Bid,
    Apply,
    Apply_Project,
    Job_Favorite,
    Project_Favorite,
    Transaction_Report
};
