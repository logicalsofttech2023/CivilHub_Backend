const mongoose = require('mongoose');

const companyFourtfoiloadd = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  name: { type: String, required: true },
  about_project: { type: String, required: true },
  image: { type: String },
  skills: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const projectCompanySchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId,ref: "users", required: true },
    catID: { type: mongoose.Schema.Types.ObjectId, required: true },
    project_name: { type: String, required: true },
    project_description: { type: String },
    experience: { type: String },
    budget_type: { type: String },
    min_budget: { type: String },
    mxn_budget: { type: String },
    skills: [{ type: String }], 
    fileattach: { type: String, default: null }, 
    total_proposal: { type: String, default: "0" }, 
    favorite_status: { type: String, default: "0" }
}, { timestamps: true });

const JobSchemaComapny = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    catID: { type: mongoose.Schema.Types.ObjectId, required: true },
    job_title: { type: String, required: true },
    job_type: { type: String, required: true },
    job_description: { type: String },
    job_responsibilities: { type: String },
    work_location_type: { type: String },
    location: { type: String },
    min_salary: { type: String },
    mxn_salary: { type: String },
    education: { type: String },
    english: { type: String },
    experience: { type: String },
    skills: [{ type: String }], 
    // job_type: { type: String, required: true },
    // job_description: { type: String, required: true },
    // est_time: { type: String, required: true },
    // exp_lavel: { type: String, required: true },
    // fileattach: { type: String, default: null }, 
    total_proposal: { type: String, default: "0" }, 
    favorite_status: { type: String, default: "0" }
}, { timestamps: true });


const SaveLikeSchema = new mongoose.Schema({
    liked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
    freelancerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
    save_like_status: {
      type: Number, 
      required: true,
    },
  }, { timestamps: true });



const FourtFolio = mongoose.model('company_fortfolios', companyFourtfoiloadd);
const Project = mongoose.model('projects', projectCompanySchema);
const Job = mongoose.model('postsjobs', JobSchemaComapny);
const save_status = mongoose.model("savelikes", SaveLikeSchema);

module.exports = { 
    FourtFolio,
    Project,
    Job,
   save_status
};
