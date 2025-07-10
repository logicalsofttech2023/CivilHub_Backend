const mongoose = require("mongoose");

const adminAboutsSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

const admintermsSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

const adminprivacySchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

const adminFAQSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

const AdminloginSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

AdminloginSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const BlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});

const AdmincategoryFreelancerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const AdminsubcategoryFreelancerSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "freelancer_categories",
      required: true,
    },
    sub_cate_name: { type: String, required: true },
    sub_cat_image: { type: String, required: true },
  },
  { timestamps: true }
);

const AdmincategoryjobSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const AdminblogaddSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    other_name: { type: String },
    like_status: { type: String, default: "0" },
  },
  { timestamps: true }
);

const AdminbannerAdd = new mongoose.Schema(
  {
    title: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const AdminskillsAdd = new mongoose.Schema(
  {
    name: { type: String },
  },
  { timestamps: true }
);

const AdminFreelancerbannerAdd = new mongoose.Schema(
  {
    title: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const AdminmarketcategoryjobSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const AdminservicecategoryjobSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const AdminmarketplacebannerAdd = new mongoose.Schema(
  {
    title: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Adminmarketplaceskilleds = new mongoose.Schema(
  {
    title: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const AdminmarkettoolsEquipment = new mongoose.Schema(
  {
    marketcateid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "market_categories",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    rate: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const AdmintendorblogaddSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    other_name: { type: String },
    like_status: { type: String, default: "0" },
  },
  { timestamps: true }
);

const AdmintendoraddSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    work_description: { type: String, required: true },
    pre_qualification: { type: String },
    remarks: { type: String },
    tendor_value: { type: Number },
    product_category: { type: String },
    sub_category: { type: String },
    contract_type: { type: String },
    bid_validity: { type: Number },
    period_of_work: { type: Number },
    location: { type: String, required: true },
    pincode: { type: String },
    pre_bid_meeting_address: { type: String },
    pre_bid_meeting_date: { type: String },
    bid_opening_place: { type: String },
    allow_nda_tendor: { type: String },
    allow_preferential_bidder: { type: String },
    published_date: { type: String },
    bid_opening_date: { type: String },
    document_start_date: { type: String },
    document_end_date: { type: String },
    clarification_start_date: { type: String },
    clarification_end_date: { type: String },
    bid_submission_start_date: { type: String },
    bid_submission_end_date: { type: String },

    nit_document: [
      {
        nit_doc_file: {
          type: String,
          required: false,
        },
        nit_description: {
          type: String,
          required: false,
        },
        nit_size: {
          type: String,
          required: false,
        },
      },
    ],
    pre_bid_meeting_document: [
      {
        pre_bid_doc_file: {
          type: String,
          required: false,
        },
        pre_bid_description: {
          type: String,
          required: false,
        },
        pre_bid_size: {
          type: String,
          required: false,
        },
      },
    ],
    work_item_document: [
      {
        work_item_doc_file: {
          type: String,
          required: false,
        },
        work_item_description: {
          type: String,
          required: false,
        },
        work_item_type: {
          type: String,
          required: false,
        },
        work_item_size: {
          type: String,
          required: false,
        },
      },
    ],
    corrigendum_list: [
      {
        corrigendum_title: {
          type: String,
          required: false,
        },
        corrigendum_type: {
          type: String,
          required: false,
        },
        corrigendum_doc_file: {
          type: String,
          required: false,
        },
      },
    ],
    tendor_inviting_authority: [
      {
        tendor_inviting_name: {
          type: String,
          required: false,
        },
        tendor_inviting_address: {
          type: String,
          required: false,
        },
      },
    ],
    tendor_fee_in: { type: Number },
    fee_payable_to: { type: Number },
    fee_payable_at: { type: Number },
    tendor_fee_exemption_allow: { type: String },
    emd_ammount: { type: Number },
    emd_fee_type: { type: String },
    emd_payable_to: { type: String },
    emd_exemption_allow: { type: String },
    emd_percentage: { type: String },
    emd_payable_at: { type: String },
    organisation_chain: { type: String },
    tendor_reference_no: { type: String },
    tendor_id: { type: String },
    tendor_type: { type: String },
    tendor_category: { type: String },
    general_tech_evaluation_allow: { type: String },
    payment_mode: { type: String },
    multiple_curreny_allow: { type: String },
    withdrawl_allow: { type: String },
    form_of_contract: { type: String },
    no_of_covers: { type: String },
    itemwise_tech_evaluation_allow: { type: String },
    multiple_curreny_allow_bdq: { type: String },
    allow_two_stage_bidding: { type: String },
    closeing_date: { type: String },
    tendor_ammount: { type: Number },
    pre_bid_meeting_place: { type: String },
    featured_image: { type: String },
  },
  { timestamps: true }
);

const AdminBusinessbannerAdd = new mongoose.Schema(
  {
    title: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const AdminCompanybannerAdd = new mongoose.Schema(
  {
    title: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const AdminIndividualbannerAdd = new mongoose.Schema(
  {
    title: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const AdminmainpowercategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const AdminsubcategorymainPowerSchema = new mongoose.Schema(
  {
    power_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "main_power_categories",
      required: true,
    },
    sub_cate_name: { type: String, required: true },
    mainsub_cat_image: { type: String, required: true },
  },
  { timestamps: true }
);

const AdminJobPositionCategorySchema = new mongoose.Schema(
  {
    name: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const AdminJobPositionSubCategorySchema = new mongoose.Schema(
  {
    name: { type: String },
    image: { type: String },
    jobPositionCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job_position_categories",
      required: true,
    },
  },
  { timestamps: true }
);

const FreelancerHeadLineSchema = new mongoose.Schema(
  {
    headline: { type: String },
    subheadline: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const BusinessHeadLineSchema = new mongoose.Schema(
  {
    headline: { type: String },
    subheadline: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const CompanyHeadLineSchema = new mongoose.Schema(
  {
    headline: { type: String },
    subheadline: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const IndividualHeadLineSchema = new mongoose.Schema(
  {
    headline: { type: String },
    subheadline: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const FreelancerBenefitSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

const BusinessBenefitSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

const CompanyBenefitSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

const IndividualBenefitSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

const FreelancerWorkSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const adminauth = mongoose.model("admins", AdminloginSchema);
const adminblacklist = mongoose.model("admins_blacklists", BlacklistSchema);
const About = mongoose.model("abouts", adminAboutsSchema);
const Terms = mongoose.model("terms_condition", admintermsSchema);
const Privacy = mongoose.model("privacies", adminprivacySchema);
const FAQ = mongoose.model("faqs", adminFAQSchema);
const FreelancerCategory = mongoose.model(
  "freelancer_categories",
  AdmincategoryFreelancerSchema
);
const FreelancerSubCategory = mongoose.model(
  "freelancer_subcategories",
  AdminsubcategoryFreelancerSchema
);
const Cate_job = mongoose.model("categories_jobs", AdmincategoryjobSchema);
const Blogs = mongoose.model("blogs", AdminblogaddSchema);
const Banner = mongoose.model("banners", AdminbannerAdd);
const Skill = mongoose.model("skills", AdminskillsAdd);
const freelancerbanner = mongoose.model(
  "freelancer_banners",
  AdminFreelancerbannerAdd
);
const marketcate = mongoose.model(
  "market_categories",
  AdminmarketcategoryjobSchema
);
const servicecate = mongoose.model(
  "service_categories",
  AdminservicecategoryjobSchema
);
const market_banner = mongoose.model(
  "market_place_banners",
  AdminmarketplacebannerAdd
);
const market_skilled = mongoose.model(
  "market_place_skilled",
  Adminmarketplaceskilleds
);
const market_tools = mongoose.model(
  "market_tools_equipments",
  AdminmarkettoolsEquipment
);
const tendorBlogs = mongoose.model("tendor_blogs", AdmintendorblogaddSchema);
const TendorList = mongoose.model("tendor_list", AdmintendoraddSchema);
const BussinessBanner = mongoose.model(
  "business_banners",
  AdminBusinessbannerAdd
);
const CompanyBanner = mongoose.model("company_banners", AdminCompanybannerAdd);
const IndividualBanner = mongoose.model(
  "individual_banners",
  AdminIndividualbannerAdd
);
const Power_Cat = mongoose.model(
  "main_power_categories",
  AdminmainpowercategorySchema
);
const Power_Cat_Sub = mongoose.model(
  "main_power_sub_categories",
  AdminsubcategorymainPowerSchema
);
const FreelancerHeadline = mongoose.model(
  "freelancer_headline",
  FreelancerHeadLineSchema
);
const BusinessHeadline = mongoose.model(
  "business_headline",
  BusinessHeadLineSchema
);
const CompanyHeadline = mongoose.model(
  "company_headline",
  CompanyHeadLineSchema
);
const IndividualHeadline = mongoose.model(
  "individual_headline",
  IndividualHeadLineSchema
);
const FreelancerBenefit = mongoose.model(
  "freelancer_benefit",
  FreelancerBenefitSchema
);
const BusinessBenefit = mongoose.model(
  "business_benefit",
  BusinessBenefitSchema
);
const CompanyBenefit = mongoose.model("company_benefit", CompanyBenefitSchema);
const IndividualBenefit = mongoose.model(
  "individual_benefit",
  IndividualBenefitSchema
);
const FreelancerWork = mongoose.model("freelancer_work", FreelancerWorkSchema);
const jobPositionCategory = mongoose.model(
  "job_position_categories",
  AdminJobPositionCategorySchema
);
const jobPositionSubCategory = mongoose.model(
  "job_position_sub_categories",
  AdminJobPositionSubCategorySchema
);

module.exports = {
  About,
  Terms,
  Privacy,
  FAQ,
  adminauth,
  adminblacklist,
  FreelancerCategory,
  Cate_job,
  Blogs,
  Banner,
  Skill,
  FreelancerSubCategory,
  freelancerbanner,
  marketcate,
  servicecate,
  market_banner,
  market_skilled,
  market_tools,
  tendorBlogs,
  TendorList,
  BussinessBanner,
  CompanyBanner,
  IndividualBanner,
  Power_Cat,
  Power_Cat_Sub,
  FreelancerHeadline,
  BusinessHeadline,
  CompanyHeadline,
  IndividualHeadline,
  FreelancerBenefit,
  BusinessBenefit,
  CompanyBenefit,
  IndividualBenefit,
  FreelancerWork,
  jobPositionCategory,
  jobPositionSubCategory,
};
