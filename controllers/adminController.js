const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const BASE_URL = "http://192.168.29.203:5000/";
const {
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
} = require("../models/adminModel");
const {
  Business_Product,
  Business_Service,
} = require("../models/businessModel");

const { Auth } = require("../models/authsModel");
const { Job } = require("../models/companyModel");
const { subAdmins, adminRoles } = require("../models/AdminRole");
const CryptoJS = require("crypto-js");

require("dotenv").config();

const getAboutUS = async (req, res) => {
  try {
    const aboutData = await About.find();

    if (!aboutData) {
      return res.status(400).json({
        result: "false",
        msg: "No data found!",
      });
    }

    res.status(200).json({
      result: "true",
      msg: "Fetched About List",
      data: aboutData,
    });
  } catch (error) {
    res.status(500).json({
      result: "false",
      msg: "Server error!",
      error: error.message,
    });
  }
};

const updateAboutUS = async (req, res) => {
  try {
    const { aboutId } = req.query;
    const { title, description, type } = req.body;

    if (!aboutId) {
      return res.status(400).json({
        result: "false",
        msg: "aboutId is required! optional ( title, description, type (Freelancer/Company) )",
      });
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (type) updatedData.type = type;

    const updatedAbout = await About.findByIdAndUpdate(aboutId, updatedData, {
      new: true,
    });

    if (!updatedAbout) {
      return res.status(400).json({
        result: "false",
        msg: "Failed to update! No matching data found.",
      });
    }

    res.status(200).json({
      result: "true",
      msg: "About Us updated successfully!",
      data: updatedAbout,
    });
  } catch (error) {
    res.status(500).json({
      result: "false",
      msg: "Server error!",
      error: error.message,
    });
  }
};

const getTermscondition = async (req, res) => {
  try {
    const fatchtems = await Terms.find();
    if (!fatchtems) {
      return res.status(400).json({
        result: "false",
        msg: "No data found!",
      });
    }

    res.status(201).json({
      result: "true",
      msg: "All Data Terms Condition List",
      data: fatchtems,
    });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "server error",
      error: error.message,
    });
  }
};

const updateTermscondition = async (req, res) => {
  try {
    const { termsId } = req.query;
    const { title, description, type } = req.body;

    if (!termsId) {
      return res.status(400).json({
        result: "false",
        msg: "termsId is required! optional ( title, description, type (Freelancer/Company) )",
      });
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (type) updatedData.type = type;

    const updatedTerms = await Terms.findByIdAndUpdate(termsId, updatedData, {
      new: true,
    });

    if (!updatedTerms) {
      return res.status(400).json({
        result: "false",
        msg: "Failed to update! No matching data found.",
      });
    }

    res.status(200).json({
      result: "true",
      msg: "Terms Condition updated successfully!",
      data: updatedTerms,
    });
  } catch (error) {
    res.status(500).json({
      result: "false",
      msg: "Server error!",
      error: error.message,
    });
  }
};

const getprivacyPolicy = async (req, res) => {
  try {
    const privacyData = await Privacy.find();

    if (!privacyData) {
      return res.status(400).json({
        result: "false",
        msg: "No data found!",
      });
    }

    res.status(200).json({
      result: "true",
      msg: "Fetched Privacy List",
      data: privacyData,
    });
  } catch (error) {
    res.status(500).json({
      result: "false",
      msg: "Server error!",
      error: error.message,
    });
  }
};

const updateprivacyPolicy = async (req, res) => {
  try {
    const { privacyId } = req.query;
    const { title, description, type } = req.body;

    if (!privacyId) {
      return res.status(400).json({
        result: "false",
        msg: "privacyId is required! optional ( title, description, type (Freelancer/Company) )",
      });
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (type) updatedData.type = type;

    const updatedPrivacy = await Privacy.findByIdAndUpdate(
      privacyId,
      updatedData,
      { new: true }
    );

    if (!updatedPrivacy) {
      return res.status(400).json({
        result: "false",
        msg: "Failed to update! No matching data found.",
      });
    }

    res.status(200).json({
      result: "true",
      msg: "Privacy Policy Us updated successfully!",
      data: updatedPrivacy,
    });
  } catch (error) {
    res.status(500).json({
      result: "false",
      msg: "Server error!",
      error: error.message,
    });
  }
};

const getfaqlist = async (req, res) => {
  try {
    const fatchfaq = await FAQ.find();
    if (!fatchfaq) {
      return res.status(400).json({
        result: "false",
        msg: "No data found!",
      });
    }

    res.status(201).json({
      result: "true",
      msg: "All Data Faq's List",
      data: fatchfaq,
    });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "server error",
      error: error.message,
    });
  }
};

const updatefaqs = async (req, res) => {
  try {
    const { faqId } = req.query;
    const { title, description, type } = req.body;

    if (!faqId) {
      return res.status(400).json({
        result: "false",
        msg: "faqId is required! optional ( title, description, type (Freelancer/Company) )",
      });
    }

    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (type) updatedData.type = type;

    const updatedFaq = await FAQ.findByIdAndUpdate(faqId, updatedData, {
      new: true,
    });

    if (!updatedFaq) {
      return res.status(400).json({
        result: "false",
        msg: "Failed to update! No matching data found.",
      });
    }

    res.status(200).json({
      result: "true",
      msg: "Faq's updated successfully!",
      data: updatedFaq,
    });
  } catch (error) {
    res.status(500).json({
      result: "false",
      msg: "Server error!",
      error: error.message,
    });
  }
};

const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        result: false,
        msg: "email and password are required!",
      });
    }
    const admin = await adminauth.findOne({ email: email });
    if (!admin) {
      return res.status(400).json({
        result: false,
        msg: "Invalid Email or Password!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        result: false,
        msg: "Invalid Email or Password!",
      });
    }

    const token = jwt.sign(
      {
        _id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      result: true,
      msg: "Admin Login successful!",
      token,
      data: {
        _id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error logging in!",
      error: error.message,
    });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ result: false, msg: "No token provided." });
    }

    await adminblacklist.create({ token });

    return res
      .status(200)
      .json({ result: true, msg: "Logout successful. Token invalidated." });
  } catch (error) {
    return res
      .status(500)
      .json({ result: false, msg: "Error logging out", error: error.message });
  }
};

const AdmincategoryAddFreelancer = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: name",
      });
    }

    const cate = new FreelancerCategory({
      name,
    });

    await cate.save();

    res.status(200).json({
      result: true,
      msg: "Admin Freelancer Category Added Successfully",
      data: cate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin freelancer category",
      error: error.message,
    });
  }
};

const AdminBlogsAdd = async (req, res) => {
  try {
    const { title, description, date, other_name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title || !description || !date || !other_name || !image) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, description, date, other_name, image",
      });
    }

    if (!image) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: image",
      });
    }

    const blog = new Blogs({
      title,
      description,
      date,
      other_name,
      image,
    });

    await blog.save();

    res.status(200).json({
      result: true,
      msg: "Admin Blogs Added Successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin blog",
      error: error.message,
    });
  }
};

const AdminBannerAdd = async (req, res) => {
  try {
    const { title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, image",
      });
    }

    const bann = new Banner({
      title,
      image,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Admin Banner Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin banner",
      error: error.message,
    });
  }
};

const AllcategoryFatch = async (req, res) => {
  try {
    const fatchcate = await FreelancerCategory.find().sort({ _id: -1 });

    if (!fatchcate || fatchcate.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No categories found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Category List",
      data: fatchcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AllbanneryFatch = async (req, res) => {
  try {
    const fatchbanner = await Banner.find().sort({ _id: -1 });

    if (!fatchbanner || fatchbanner.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No banner found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Banner List",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AllblogsFatch = async (req, res) => {
  try {
    const fatchblog = await Blogs.find().sort({ _id: -1 });

    if (!fatchblog || fatchblog.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No blog found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Blog List",
      data: fatchblog,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AdminskillsAdd = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: name",
      });
    }

    const skill = new Skill({
      name,
    });

    await skill.save();

    res.status(200).json({
      result: true,
      msg: "Admin Skills Added Successfully",
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin skills",
      error: error.message,
    });
  }
};

const AllskillsFatch = async (req, res) => {
  try {
    const fatchskills = await Skill.find().sort({ _id: -1 });

    if (!fatchskills || fatchskills.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No skills found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Skills List",
      data: fatchskills,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AdmincategoryjobAdd = async (req, res) => {
  try {
    const { name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!name || !image) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: name, image",
      });
    }

    const cate = new Cate_job({
      name,
      image,
    });

    await cate.save();

    res.status(200).json({
      result: true,
      msg: "Admin Job Category Added Successfully",
      data: cate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding job admin category",
      error: error.message,
    });
  }
};

const AdmincategoryUpdate = async (req, res) => {
  try {
    const { categoryId, name } = req.body;
    if (!categoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: categoryId, optional( name )",
      });
    }

    const fatchcate = await FreelancerCategory.findById(categoryId);
    if (!fatchcate) {
      return res.status(404).json({
        result: false,
        msg: "Category Not Found!",
      });
    }

    if (name) fatchcate.name = name;
    await fatchcate.save();

    res.status(200).json({
      result: true,
      msg: "Admin Category Updated Successfully",
      data: fatchcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin category",
      error: error.message,
    });
  }
};

const AdmincategoryFreelancerDetails = async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: categoryId",
      });
    }

    const fatchcate = await FreelancerCategory.findById(categoryId);
    if (!fatchcate) {
      return res.status(404).json({
        result: false,
        msg: "Category Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Freelancer Category Details Successfully",
      data: fatchcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin  freelancer category",
      error: error.message,
    });
  }
};

const AdmincategoryDelete = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: categoryId",
      });
    }

    const fatchcate = await FreelancerCategory.findById(categoryId);
    if (!fatchcate) {
      return res.status(404).json({
        result: false,
        msg: "Category Not Found!",
      });
    }

    await FreelancerCategory.findByIdAndDelete(categoryId);

    res.status(200).json({
      result: true,
      msg: "Admin Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin category",
      error: error.message,
    });
  }
};

const AdminSubcategoryFreelancerAdd = async (req, res) => {
  try {
    const { category_id, sub_cate_name } = req.body;
    const sub_cat_image =
      req.files && req.files.sub_cat_image
        ? req.files.sub_cat_image[0].filename
        : null;

    if (!category_id || !sub_cate_name) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: category_id, sub_cate_name",
      });
    }

    if (!sub_cat_image) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: sub_cat_image",
      });
    }

    const Subcate = new FreelancerSubCategory({
      category_id,
      sub_cate_name,
      sub_cat_image,
    });

    await Subcate.save();

    res.status(200).json({
      result: true,
      msg: "Admin Sub Category Added Successfully",
      data: Subcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding sub category",
      error: error.message,
    });
  }
};

const AdminSubcategoryList = async (req, res) => {
  try {
    const subcategories = await FreelancerSubCategory.find()
      .sort({ _id: -1 })
      .populate("category_id", "name")
      .exec();

    res.status(200).json({
      result: true,
      msg: "Subcategories fetched successfully",
      path: BASE_URL + "uploads/admin/",
      data: subcategories,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching subcategories",
      error: error.message,
    });
  }
};

const AdminSubcategoryUpdate = async (req, res) => {
  try {
    const { subcatId, category_id, sub_cate_name } = req.body;
    const sub_cat_image =
      req.files && req.files.sub_cat_image
        ? req.files.sub_cat_image[0].filename
        : null;
    if (!subcatId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: subcatId, optional( category_id, sub_cate_name, sub_cat_image )",
      });
    }

    const fatchsubcate = await FreelancerSubCategory.findById(subcatId);
    if (!fatchsubcate) {
      return res.status(404).json({
        result: false,
        msg: "Sub Category Not Found!",
      });
    }

    if (category_id) fatchsubcate.category_id = category_id;
    if (sub_cate_name) fatchsubcate.sub_cate_name = sub_cate_name;
    if (sub_cat_image) fatchsubcate.sub_cat_image = sub_cat_image;
    await fatchsubcate.save();

    res.status(200).json({
      result: true,
      msg: "Admin Sub Category Updated Successfully",
      data: fatchsubcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin sub category",
      error: error.message,
    });
  }
};

const AdminSubcategoryDelete = async (req, res) => {
  try {
    const { subcatId } = req.body;

    if (!subcatId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: subcatId",
      });
    }

    const fatchsubcate = await FreelancerSubCategory.findById(subcatId);
    if (!fatchsubcate) {
      return res.status(404).json({
        result: false,
        msg: "Sub Category Not Found!",
      });
    }

    await FreelancerSubCategory.findByIdAndDelete(subcatId);

    res.status(200).json({
      result: true,
      msg: "Admin Sub Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin sub category",
      error: error.message,
    });
  }
};

const AdmincategoryDetails = async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: categoryId",
      });
    }

    const fatchcate = await Category.findById(categoryId);
    if (!fatchcate) {
      return res.status(404).json({
        result: false,
        msg: "Category Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Category Details Successfully",
      data: fatchcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin category",
      error: error.message,
    });
  }
};

const AdminSubcategorydetails = async (req, res) => {
  try {
    const { subcatId } = req.query;

    if (!subcatId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: subcatId",
      });
    }

    const fatchsubcate = await FreelancerSubCategory.findById(subcatId)
      .populate("category_id", "name")
      .exec();

    if (!fatchsubcate) {
      return res.status(404).json({
        result: false,
        msg: "Sub Category Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Sub Category Details Successfully",
      path: BASE_URL + "uploads/admin/",
      data: fatchsubcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching admin subcategory details",
      error: error.message,
    });
  }
};

const AdminjobcategoryDetails = async (req, res) => {
  try {
    const { jobcategoryId } = req.query;

    if (!jobcategoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: jobcategoryId",
      });
    }

    const fatchcatejob = await Cate_job.findById(jobcategoryId);
    if (!fatchcatejob) {
      return res.status(404).json({
        result: false,
        msg: "Job Category Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Job Category Details Successfully",
      data: fatchcatejob,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin job category",
      error: error.message,
    });
  }
};

const AdminjobcategoryUpdate = async (req, res) => {
  try {
    const { jobcategoryId, name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!jobcategoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: jobcategoryId, optional( name, image )",
      });
    }

    const fatchjobcate = await Cate_job.findById(jobcategoryId);
    if (!fatchjobcate) {
      return res.status(404).json({
        result: false,
        msg: "Job Category Not Found!",
      });
    }

    if (name) fatchjobcate.name = name;
    if (image) fatchjobcate.image = image;
    await fatchjobcate.save();

    res.status(200).json({
      result: true,
      msg: "Admin Job Category Updated Successfully",
      data: fatchjobcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin job category",
      error: error.message,
    });
  }
};

const AdminjobcategoryDelete = async (req, res) => {
  try {
    const { jobcategoryId } = req.body;

    if (!jobcategoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: jobcategoryId",
      });
    }

    const fatchjobcate = await Cate_job.findById(jobcategoryId);
    if (!fatchjobcate) {
      return res.status(404).json({
        result: false,
        msg: "Job Category Not Found!",
      });
    }

    await Cate_job.findByIdAndDelete(jobcategoryId);

    res.status(200).json({
      result: true,
      msg: "Admin Job Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin job category",
      error: error.message,
    });
  }
};

const AlljobcategoryFatch = async (req, res) => {
  try {
    const fatchcatejob = await Cate_job.find().sort({ _id: -1 });

    if (!fatchcatejob || fatchcatejob.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No job categories found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Job Category List",
      data: fatchcatejob,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AdminbannerDetails = async (req, res) => {
  try {
    const { bannerId } = req.query;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await Banner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Banner Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Banner Details Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin banner",
      error: error.message,
    });
  }
};

const AdminbannerUpdate = async (req, res) => {
  try {
    const { bannerId, title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId, optional( title, image )",
      });
    }

    const fatchbanner = await Banner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Banner Not Found!",
      });
    }

    if (title) fatchbanner.title = title;
    if (image) fatchbanner.image = image;
    await fatchbanner.save();

    res.status(200).json({
      result: true,
      msg: "Admin Banner Updated Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin banner",
      error: error.message,
    });
  }
};

const AdminbannerDelete = async (req, res) => {
  try {
    const { bannerId } = req.body;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await Banner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Banner Not Found!",
      });
    }

    await Banner.findByIdAndDelete(bannerId);

    res.status(200).json({
      result: true,
      msg: "Admin Banner Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin banner",
      error: error.message,
    });
  }
};

const AdminBlogsDetails = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!blogId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: blogId",
      });
    }

    const fatchblog = await Blogs.findById(blogId);
    if (!fatchblog) {
      return res.status(404).json({
        result: false,
        msg: "Blogs Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Blogs Details Successfully",
      data: fatchblog,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin blogs",
      error: error.message,
    });
  }
};

const AdminblogsUpdate = async (req, res) => {
  try {
    const { blogId, title, description, date, other_name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!blogId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: blogId, optional( title, description, date, other_name, image )",
      });
    }

    const fatchblogs = await Blogs.findById(blogId);
    if (!fatchblogs) {
      return res.status(404).json({
        result: false,
        msg: "Blogs Not Found!",
      });
    }

    if (title) fatchblogs.title = title;
    if (description) fatchblogs.description = description;
    if (date) fatchblogs.date = date;
    if (other_name) fatchblogs.other_name = other_name;
    if (image) fatchblogs.image = image;
    await fatchblogs.save();

    res.status(200).json({
      result: true,
      msg: "Admin Blogs Updated Successfully",
      data: fatchblogs,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin blogs",
      error: error.message,
    });
  }
};

const AdminblogsDelete = async (req, res) => {
  try {
    const { blogId } = req.body;

    if (!blogId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: blogId",
      });
    }

    const fatchblogs = await Blogs.findById(blogId);
    if (!fatchblogs) {
      return res.status(404).json({
        result: false,
        msg: "Blogs Not Found!",
      });
    }

    await Blogs.findByIdAndDelete(blogId);

    res.status(200).json({
      result: true,
      msg: "Admin Blogs Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin blogs",
      error: error.message,
    });
  }
};

const AdminskillsDetails = async (req, res) => {
  try {
    const { skillId } = req.params;

    if (!skillId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: skillId",
      });
    }

    const skillblog = await Skill.findById(skillId);
    if (!skillblog) {
      return res.status(404).json({
        result: false,
        msg: "Skills Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Skills Details Successfully",
      data: skillblog,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin skills",
      error: error.message,
    });
  }
};

const AdminskillsUpdate = async (req, res) => {
  try {
    const { skillId, name } = req.body;

    if (!skillId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: skillId, optional( name )",
      });
    }

    const fatchskill = await Skill.findById(skillId);
    if (!fatchskill) {
      return res.status(404).json({
        result: false,
        msg: "Skills Not Found!",
      });
    }

    if (name) fatchskill.name = name;

    await fatchskill.save();

    res.status(200).json({
      result: true,
      msg: "Admin Skills Updated Successfully",
      data: fatchskill,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin skill",
      error: error.message,
    });
  }
};

const AdminbskillDelete = async (req, res) => {
  try {
    const { skillId } = req.body;

    if (!skillId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: skillId",
      });
    }

    const fatchskill = await Skill.findById(skillId);
    if (!fatchskill) {
      return res.status(404).json({
        result: false,
        msg: "Skills Not Found!",
      });
    }

    await Skill.findByIdAndDelete(skillId);

    res.status(200).json({
      result: true,
      msg: "Admin Skills Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin skills",
      error: error.message,
    });
  }
};

const alluserList = async (req, res) => {
  try {
    const fatchallUser = await Auth.find().sort({ _id: -1 });
    if (!fatchallUser) {
      return res.status(404).json({
        result: false,
        msg: "User Not Found!",
      });
    }
    res.status(200).json({
      result: true,
      msg: "User Fatched Successfully",
      data: fatchallUser,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting user",
      error: error.message,
    });
  }
};

const AdminfreelancerBannerAdd = async (req, res) => {
  try {
    const { title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, image",
      });
    }

    const bann = new freelancerbanner({
      title,
      image,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Admin Freelancer Banner Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin banner",
      error: error.message,
    });
  }
};

const AllfreelancerbanneryFatch = async (req, res) => {
  try {
    const fatchbanner = await freelancerbanner.find().sort({ _id: -1 });

    if (!fatchbanner || fatchbanner.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No banner found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Freelancer Banner List",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AdminfreelancerbannerUpdate = async (req, res) => {
  try {
    const { bannerId, title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId, optional( title, image )",
      });
    }

    const fatchbanner = await freelancerbanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Freelancer Banner Not Found!",
      });
    }

    if (title) fatchbanner.title = title;
    if (image) fatchbanner.image = image;
    await fatchbanner.save();

    res.status(200).json({
      result: true,
      msg: "Admin Freelancer Banner Updated Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin banner",
      error: error.message,
    });
  }
};

const AdminfreelancerbannerDetails = async (req, res) => {
  try {
    const { bannerId } = req.params;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await freelancerbanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Banner Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Freelancer Banner Details Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin banner",
      error: error.message,
    });
  }
};

const AdminfreelancerbannerDelete = async (req, res) => {
  try {
    const { bannerId } = req.body;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await freelancerbanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Freelancer Banner Not Found!",
      });
    }

    await freelancerbanner.findByIdAndDelete(bannerId);

    res.status(200).json({
      result: true,
      msg: "Admin Freelancr Banner Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin banner",
      error: error.message,
    });
  }
};

const AdminmarketCategoryAdd = async (req, res) => {
  try {
    const { name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!name) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: name, image",
      });
    }

    const bann = new marketcate({
      name,
      image,
    });
    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Admin Market Category Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin market category",
      error: error.message,
    });
  }
};

const AllmarketcategoryFatch = async (req, res) => {
  try {
    const fatchcate = await marketcate.find().sort({ _id: -1 });

    if (!fatchcate || fatchcate.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No market categories found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Market Category List",
      data: fatchcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AdminmarketcategoryUpdate = async (req, res) => {
  try {
    const { categoryId, name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!categoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: categoryId, optional( name, image )",
      });
    }

    const fatchmarket = await marketcate.findById(categoryId);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Market Category Not Found!",
      });
    }

    if (name) fatchmarket.name = name;
    if (image) fatchmarket.image = image;
    await fatchmarket.save();

    res.status(200).json({
      result: true,
      msg: "Admin Market Category Updated Successfully",
      data: fatchmarket,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin category",
      error: error.message,
    });
  }
};

const AdminmarketcategoryDetails = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: categoryId",
      });
    }

    const fatchmarket = await marketcate.findById(categoryId);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Market Category Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Market Category Details Successfully",
      data: fatchmarket,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin category",
      error: error.message,
    });
  }
};

const AdminmarketcategoryDelete = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: categoryId",
      });
    }

    const fatchmarket = await marketcate.findById(categoryId);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Market Category Not Found!",
      });
    }

    await marketcate.findByIdAndDelete(categoryId);

    res.status(200).json({
      result: true,
      msg: "Admin Market Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin category",
      error: error.message,
    });
  }
};

const AdminserviceCategoryAdd = async (req, res) => {
  try {
    const { name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!name) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: name, image",
      });
    }

    const bann = new servicecate({
      name,
      image,
    });
    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Admin Service Category Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin market category",
      error: error.message,
    });
  }
};

const AllservicecategoryFatch = async (req, res) => {
  try {
    const fatchcate = await servicecate.find().sort({ _id: -1 });

    if (!fatchcate || fatchcate.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No service categories found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Service Category List",
      data: fatchcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AdminservicecategoryUpdate = async (req, res) => {
  try {
    const { categoryId, name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!categoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: categoryId, optional( name, image )",
      });
    }

    const fatchmarket = await servicecate.findById(categoryId);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Service Category Not Found!",
      });
    }

    if (name) fatchmarket.name = name;
    if (image) fatchmarket.image = image;
    await fatchmarket.save();

    res.status(200).json({
      result: true,
      msg: "Admin Service Category Updated Successfully",
      data: fatchmarket,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin category",
      error: error.message,
    });
  }
};

const AdminservicecategoryDetails = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: categoryId",
      });
    }

    const fatchmarket = await servicecate.findById(categoryId);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Service Category Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Service Category Details Successfully",
      data: fatchmarket,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin category",
      error: error.message,
    });
  }
};

const AdminservicecategoryDelete = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: categoryId",
      });
    }

    const fatchmarket = await marketcate.findById(categoryId);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Market Category Not Found!",
      });
    }

    await marketcate.findByIdAndDelete(categoryId);

    res.status(200).json({
      result: true,
      msg: "Admin Market Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin category",
      error: error.message,
    });
  }
};

const usercloseAccount = async (req, res) => {
  try {
    const { userID } = req.body;

    if (!userID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userID",
      });
    }

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid userID format",
      });
    }

    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    user.block_status = user.block_status === 1 ? 0 : 1;

    await user.save();

    res.status(200).json({
      result: true,
      msg:
        user.block_status === 1
          ? "User account blocked"
          : "User account unblocked",
      data: {
        userID: user._id,
        block_status: user.block_status,
      },
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error toggling user account status",
      error: error.message,
    });
  }
};

const AdminmarketplaceBannerAdd = async (req, res) => {
  try {
    const { title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, image",
      });
    }

    const bann = new market_banner({
      title,
      image,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Admin Market Place Banner Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin banner",
      error: error.message,
    });
  }
};

const AllmarketplacebanneryFatch = async (req, res) => {
  try {
    const fatchbanner = await market_banner.find().sort({ _id: -1 });

    if (!fatchbanner || fatchbanner.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No banner found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Market Place Banner List",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AdminmarketplacebannerUpdate = async (req, res) => {
  try {
    const { bannerId, title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId, optional( title, image )",
      });
    }

    const fatchbanner = await market_banner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Market Place Banner Not Found!",
      });
    }

    if (title) fatchbanner.title = title;
    if (image) fatchbanner.image = image;
    await fatchbanner.save();

    res.status(200).json({
      result: true,
      msg: "Admin Market Place Banner Updated Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin banner",
      error: error.message,
    });
  }
};

const AdminmarketplacebannerDetails = async (req, res) => {
  try {
    const { bannerId } = req.params;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await market_banner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Banner Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Market Place Banner Details Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin banner",
      error: error.message,
    });
  }
};

const AdminmarketplacebannerDelete = async (req, res) => {
  try {
    const { bannerId } = req.body;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await market_banner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Freelancer Banner Not Found!",
      });
    }

    await market_banner.findByIdAndDelete(bannerId);

    res.status(200).json({
      result: true,
      msg: "Admin Market Place Banner Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin banner",
      error: error.message,
    });
  }
};

const allCompanygetjobList = async (req, res) => {
  try {
    const jobs = await Job.find({})
      .sort({ _id: -1 })
      .select(
        "userID catID job_title job_type job_description job_responsibilities work_location_type location min_salary mxn_salary education english experience skills total_proposal favorite_status"
      );

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        result: false,
        msg: "No jobs found for this user",
      });
    }
    const populatedJobs = await Promise.all(
      jobs.map(async (job) => {
        let category = await Cate_job.findById(job.catID).select("name image");
        let user = await Auth.findById(job.userID).select(
          "first_name last_name"
        );
        return {
          ...job._doc,
          category_name: category?.name || "",
          category_image: category?.image || "",
          first_name: user?.first_name || "",
          last_name: user?.last_name || "",
        };
      })
    );

    return res.status(200).json({
      result: true,
      msg: "Job list fetched successfully",
      data: populatedJobs,
    });
  } catch (error) {
    console.error("Error fetching job list:", error.message);
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};

const AdminJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: jobId",
      });
    }
    const jobs = await Job.find({ _id: jobId })
      .sort({ _id: -1 })
      .select(
        "userID catID job_title job_type job_description job_responsibilities work_location_type location min_salary mxn_salary education english experience skills total_proposal favorite_status"
      );

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        result: false,
        msg: "No jobs found for this user",
      });
    }

    const populatedJobs = await Promise.all(
      jobs.map(async (job) => {
        let category = await Cate_job.findById(job.catID).select("name image");

        return {
          ...job._doc,
          category_name: category?.name || "",
          category_image: category?.image || "",
        };
      })
    );

    return res.status(200).json({
      result: true,
      msg: "Job list fetched successfully",
      data: populatedJobs,
    });
  } catch (error) {
    console.error("Error fetching job list:", error.message);
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};

const Adminmarketplaceskilledadd = async (req, res) => {
  try {
    const { title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title || !image) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, image",
      });
    }

    const bann = new market_skilled({
      title,
      image,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Admin Market Place Skilled Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin banner",
      error: error.message,
    });
  }
};

const AllmarketplaceskilledFatch = async (req, res) => {
  try {
    const market_place_skilled = await market_skilled.find().sort({ _id: -1 });

    if (!market_place_skilled || market_place_skilled.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No market skilled found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Market Place Skilled List",
      data: market_place_skilled,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AdminmarketplaceskilledUpdate = async (req, res) => {
  try {
    const { skillId, title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!skillId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: skillId, optional( title, image )",
      });
    }

    const market_place_skilled = await market_skilled.findById(skillId);
    if (!market_place_skilled) {
      return res.status(404).json({
        result: false,
        msg: "Market Place Skilled Not Found!",
      });
    }

    if (title) market_place_skilled.title = title;
    if (image) market_place_skilled.image = image;
    await market_place_skilled.save();

    res.status(200).json({
      result: true,
      msg: "Admin Market Place Skilled Updated Successfully",
      data: market_place_skilled,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin banner",
      error: error.message,
    });
  }
};

const AdminmarketplaceskilledDetails = async (req, res) => {
  try {
    const { skillId } = req.params;

    if (!skillId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: skillId",
      });
    }

    const market_postskilled = await market_skilled.findById(skillId);
    if (!market_postskilled) {
      return res.status(404).json({
        result: false,
        msg: "Market skilled Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Market Place Skilled Details Successfully",
      data: market_postskilled,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin skilled",
      error: error.message,
    });
  }
};

const AdminmarketplaceskilledDelete = async (req, res) => {
  try {
    const { skillId } = req.body;

    if (!skillId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: skillId",
      });
    }

    const market_fatch = await market_skilled.findById(skillId);
    if (!market_fatch) {
      return res.status(404).json({
        result: false,
        msg: "Market Skilled Not Found!",
      });
    }

    await market_skilled.findByIdAndDelete(skillId);

    res.status(200).json({
      result: true,
      msg: "Admin Market Place Skilled Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin skilled",
      error: error.message,
    });
  }
};

const AdminmarkettoolsEquipment = async (req, res) => {
  try {
    const { marketcateid, title, rate, description } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!marketcateid || !title || !rate || !image) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: marketcateid, title, rate, description, image",
      });
    }

    const tools = new market_tools({
      marketcateid,
      title,
      rate,
      description,
      image,
    });

    await tools.save();

    res.status(200).json({
      result: true,
      msg: "Admin Market Tools&Equipment Added Successfully",
      data: tools,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin tools",
      error: error.message,
    });
  }
};

const alleuipmenttoolslist = async (req, res) => {
  try {
    const tools = await market_tools
      .find({})
      .sort({ _id: -1 })
      .select("marketcateid title rate description image createdAt");

    if (!tools || tools.length === 0) {
      return res.status(404).json({
        result: false,
        msg: "No Tools found for this admin",
      });
    }

    const populatedtoolss = await Promise.all(
      tools.map(async (tools) => {
        let market_category = await marketcate
          .findById(tools.marketcateid)
          .select("name image");

        return {
          ...tools._doc,
          market_category_name: market_category?.name || "",
          market_category_image: market_category?.image || "",
        };
      })
    );

    return res.status(200).json({
      result: true,
      msg: "Equipment Tools list fetched successfully",
      data: populatedtoolss,
    });
  } catch (error) {
    console.error("Error fetching tools list:", error.message);
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};

const marketeuipmenttoolsdetails = async (req, res) => {
  try {
    const { equipmentID } = req.body;

    if (!equipmentID) {
      return res.status(400).json({
        result: "false",
        msg: "Parameter required: equipmentID",
      });
    }

    const tools = await market_tools
      .findById(equipmentID)
      .select("marketcateid title rate description image createdAt");

    if (!tools) {
      return res.status(404).json({
        result: false,
        msg: "No Tools Details found for this admin",
      });
    }

    const market_category = await marketcate
      .findById(tools.marketcateid)
      .select("name image");

    const populatedtools = {
      ...tools._doc,
      market_category_name: market_category?.name || "",
      market_category_image: market_category?.image || "",
    };

    return res.status(200).json({
      result: true,
      msg: "Equipment Tools Details fetched successfully",
      data: populatedtools,
    });
  } catch (error) {
    console.error("Error fetching tools details:", error.message);
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};

const AdminmarkettoolsequipmentUpdate = async (req, res) => {
  try {
    const { equipmentId, marketcateid, title, description, rate } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!equipmentId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: equipmentId, optional( marketcateid, title, description, rate, image )",
      });
    }

    const market_toolseq = await market_tools.findById(equipmentId);
    if (!market_toolseq) {
      return res.status(404).json({
        result: false,
        msg: "Market Tools Equipment Not Found!",
      });
    }

    if (marketcateid) market_toolseq.marketcateid = marketcateid;
    if (title) market_toolseq.title = title;
    if (description) market_toolseq.description = description;
    if (rate) market_toolseq.rate = rate;
    if (image) market_toolseq.image = image;
    await market_toolseq.save();

    res.status(200).json({
      result: true,
      msg: "Admin Market Tools Equipment Updated Successfully",
      data: market_toolseq,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin tools",
      error: error.message,
    });
  }
};

const AdminmarkettoolsequipmentDelete = async (req, res) => {
  try {
    const { equipmentId } = req.body;

    if (!equipmentId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: equipmentId",
      });
    }

    const market_fatch = await market_tools.findById(equipmentId);
    if (!market_fatch) {
      return res.status(404).json({
        result: false,
        msg: "Market Equipment Not Found!",
      });
    }

    await market_tools.findByIdAndDelete(equipmentId);

    res.status(200).json({
      result: true,
      msg: "Admin Market Equipment Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin tools",
      error: error.message,
    });
  }
};

const AdminTendorBlogsAdd = async (req, res) => {
  try {
    const { title, description, date, other_name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title || !description || !date || !other_name || !image) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, description, date, other_name, image",
      });
    }

    if (!image) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: image",
      });
    }

    const blog = new tendorBlogs({
      title,
      description,
      date,
      other_name,
      image,
    });

    await blog.save();

    res.status(200).json({
      result: true,
      msg: "Admin Blogs Added Successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin blog",
      error: error.message,
    });
  }
};

const AllTendorblogsFatch = async (req, res) => {
  try {
    const fatchblog = await tendorBlogs.find().sort({ _id: -1 });

    if (!fatchblog || fatchblog.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No blog found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Blog List",
      data: fatchblog,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AdminTendorBlogsDetails = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!blogId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: blogId",
      });
    }

    const fatchblog = await tendorBlogs.findById(blogId);
    if (!fatchblog) {
      return res.status(404).json({
        result: false,
        msg: "Blogs Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Tendor Blogs Details Successfully",
      data: fatchblog,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin blogs",
      error: error.message,
    });
  }
};

const AdmintendorblogsUpdate = async (req, res) => {
  try {
    const { blogId, title, description, date, other_name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!blogId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: blogId, optional( title, description, date, other_name, image )",
      });
    }

    const fatchblogs = await tendorBlogs.findById(blogId);
    if (!fatchblogs) {
      return res.status(404).json({
        result: false,
        msg: "Blogs Not Found!",
      });
    }

    if (title) fatchblogs.title = title;
    if (description) fatchblogs.description = description;
    if (date) fatchblogs.date = date;
    if (other_name) fatchblogs.other_name = other_name;
    if (image) fatchblogs.image = image;
    await fatchblogs.save();

    res.status(200).json({
      result: true,
      msg: "Admin tendor Blogs Updated Successfully",
      data: fatchblogs,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin blogs",
      error: error.message,
    });
  }
};

const AdmintendorblogsDelete = async (req, res) => {
  try {
    const { blogId } = req.body;

    if (!blogId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: blogId",
      });
    }

    const fatchblogs = await tendorBlogs.findById(blogId);
    if (!fatchblogs) {
      return res.status(404).json({
        result: false,
        msg: "Blogs Not Found!",
      });
    }

    await tendorBlogs.findByIdAndDelete(blogId);

    res.status(200).json({
      result: true,
      msg: "Admin Blogs Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin blogs",
      error: error.message,
    });
  }
};

const addUserByAdmin = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      description,
      title,
      latitude,
      longitude,
      address,
      mobile,
      about_company,
      about_project,
      account_type,
      subcategoryId,
      skills,
      links,
      panNumber,
      gstNumber,
    } = req.body;

    const profile_image = req.files?.profile_image?.[0]?.filename || null;
    const banner_image = req.files?.banner_image?.[0]?.filename || null;
    const id_proof = req.files?.id_proof?.[0]?.filename || null;
    const resume_file = req.files?.resume_file?.[0]?.filename || null;
    const panCard = req.files?.panCard?.[0]?.filename || null;
    const gstCertificate = req.files?.gstCertificate?.[0]?.filename || null;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !description ||
      !address ||
      !mobile ||
      !account_type
    ) {
      return res.status(400).json({
        result: false,
        msg: "Required parameters missing: firstName, lastName, email, password, description, address, mobile, account_type",
      });
    }

    // Generate unique username
    let baseUsername = `${first_name.toLowerCase()}${Math.floor(
      Math.random() * 10000
    )}`;
    let username = baseUsername;
    let existingUser = await Auth.findOne({ username });
    while (existingUser) {
      username = `${first_name.toLowerCase()}${Math.floor(
        Math.random() * 10000
      )}`;
      existingUser = await Auth.findOne({ username });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Auth({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      username,
      description,
      title,
      latitude,
      longitude,
      address,
      mobile,
      about_company,
      about_project,
      account_type,
      subcategoryId,
      skills,
      links,
      profile_image,
      banner_image,
      id_proof,
      resume_file,
      panCard,
      gstCertificate,
      panNumber,
      gstNumber,
      verify_otp: 1,
    });

    await newUser.save();

    res.status(200).json({
      result: true,
      msg: "User added successfully by Admin",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin user",
      error: error.message,
    });
    console.log(error);
  }
};

const getUserByAdminDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userId",
      });
    }

    const fatchblog = await Auth.findById(userId);
    if (!fatchblog) {
      return res.status(404).json({
        result: false,
        msg: "User Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin User Details Successfully",
      data: fatchblog,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin blogs",
      error: error.message,
    });
  }
};

const AdminTendorAdd = async (req, res) => {
  try {
    const {
      title,
      work_description,
      pre_qualification,
      remarks,
      tendor_value,
      product_category,
      sub_category,
      contract_type,
      bid_validity,
      period_of_work,
      location,
      pincode,
      pre_bid_meeting_address,
      pre_bid_meeting_date,
      bid_opening_place,
      allow_nda_tendor,
      allow_preferential_bidder,
      published_date,
      bid_opening_date,
      document_start_date,
      document_end_date,
      clarification_start_date,
      clarification_end_date,
      bid_submission_start_date,
      bid_submission_end_date,
      tendor_fee_in,
      fee_payable_to,
      fee_payable_at,
      tendor_fee_exemption_allow,
      emd_ammount,
      emd_fee_type,
      emd_payable_to,
      emd_exemption_allow,
      emd_percentage,
      emd_payable_at,
      organisation_chain,
      tendor_reference_no,
      tendor_id,
      tendor_type,
      tendor_category,
      general_tech_evaluation_allow,
      payment_mode,
      multiple_curreny_allow,
      withdrawl_allow,
      form_of_contract,
      no_of_covers,
      itemwise_tech_evaluation_allow,
      multiple_curreny_allow_bdq,
      allow_two_stage_bidding,
      closeing_date,
      tendor_ammount,
      pre_bid_meeting_place,
    } = req.body;

    // Handle file uploads
    const featured_image = req.files?.featured_image?.[0]?.filename || "";

    // Helper function to process document arrays
    const processDocumentArray = (prefix, fields) => {
      const result = [];
      Object.keys(req.files).forEach((key) => {
        if (key.startsWith(prefix)) {
          const match = key.match(
            new RegExp(`${prefix}\\[(\\d+)\\]\\[(\\w+)\\]`)
          );
          if (match) {
            const [_, index, field] = match;
            if (!result[index]) result[index] = {};
            result[index][field] = req.files[key][0].filename;

            // Add text fields from body
            fields.forEach((textField) => {
              const bodyField = `${prefix}[${index}][${textField}]`;
              if (req.body[prefix] && req.body[prefix][index]) {
                result[index][textField] =
                  req.body[prefix][index][textField] || "";
              } else if (req.body[bodyField]) {
                result[index][textField] = req.body[bodyField] || "";
              }
            });
          }
        }
      });
      return result.filter(Boolean);
    };

    // Process all document types
    const nitDocument = processDocumentArray("nit_document", [
      "nit_description",
      "nit_size",
    ]);
    const preBidMeetingDocument = processDocumentArray(
      "pre_bid_meeting_document",
      ["pre_bid_description", "pre_bid_size"]
    );
    const workItemDocument = processDocumentArray("work_item_document", [
      "work_item_description",
      "work_item_type",
      "work_item_size",
    ]);
    const corrigendumList = processDocumentArray("corrigendum_list", [
      "corrigendum_title",
      "corrigendum_type",
    ]);

    // Process Tender Inviting Authority (if needed)
    const tendorInvitingAuthority = [];
    if (req.body.tendor_inviting_authority) {
      const authorityData = Array.isArray(req.body.tendor_inviting_authority)
        ? req.body.tendor_inviting_authority
        : JSON.parse(req.body.tendor_inviting_authority || "[]");

      authorityData.forEach((auth) => {
        tendorInvitingAuthority.push({
          tendor_inviting_name: auth.tendor_inviting_name || "",
          tendor_inviting_address: auth.tendor_inviting_address || "",
        });
      });
    }

    // Validate required fields
    if (!title || !work_description || !location) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, work_description, location",
      });
    }

    // Create new tender document
    const tendorData = new TendorList({
      title,
      work_description,
      pre_qualification,
      remarks,
      tendor_value,
      product_category,
      sub_category,
      contract_type,
      bid_validity,
      period_of_work,
      location,
      pincode,
      pre_bid_meeting_address,
      pre_bid_meeting_date,
      bid_opening_place,
      allow_nda_tendor,
      allow_preferential_bidder,
      published_date,
      bid_opening_date,
      document_start_date,
      document_end_date,
      clarification_start_date,
      clarification_end_date,
      bid_submission_start_date,
      bid_submission_end_date,
      nit_document: nitDocument,
      pre_bid_meeting_document: preBidMeetingDocument,
      work_item_document: workItemDocument,
      corrigendum_list: corrigendumList,
      tendor_inviting_authority: tendorInvitingAuthority,
      tendor_fee_in,
      fee_payable_to,
      fee_payable_at,
      tendor_fee_exemption_allow,
      emd_ammount,
      emd_fee_type,
      emd_payable_to,
      emd_exemption_allow,
      emd_percentage,
      emd_payable_at,
      organisation_chain,
      tendor_reference_no,
      tendor_id,
      tendor_type,
      tendor_category,
      general_tech_evaluation_allow,
      payment_mode,
      multiple_curreny_allow,
      withdrawl_allow,
      form_of_contract,
      no_of_covers,
      itemwise_tech_evaluation_allow,
      multiple_curreny_allow_bdq,
      allow_two_stage_bidding,
      closeing_date,
      tendor_ammount,
      pre_bid_meeting_place,
      featured_image,
    });

    await tendorData.save();

    res.status(200).json({
      result: true,
      msg: "Admin tendor Added Successfully",
      data: tendorData,
    });
  } catch (error) {
    console.error("Error adding admin tendor:", error);
    res.status(500).json({
      result: false,
      msg: "Error adding admin tendor",
      error: error.message,
    });
  }
};

const getBusinessProduct = async (req, res) => {
  try {
    const fetchProduct = await Business_Product.find({})
      .populate("userId")
      .populate("categoryId");

    if (!fetchProduct || fetchProduct.length === 0) {
      return res.status(400).json({
        result: "false",
        msg: "No data found for type Business Product!",
      });
    }

    res.status(200).json({
      result: "true",
      msg: "Product list for type Business",
      data: fetchProduct,
    });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message,
    });
  }
};

const getBusinessService = async (req, res) => {
  try {
    const fetchService = await Business_Service.find({})
      .populate("categoryId")
      .populate("userId");

    if (!fetchService || fetchService.length === 0) {
      return res.status(400).json({
        result: "false",
        msg: "No data found for type Business Service!",
      });
    }

    res.status(200).json({
      result: "true",
      msg: "Service list for type Business",
      data: fetchService,
    });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message,
    });
  }
};

const getAllTendorListInAdmin = async (req, res) => {
  try {
    const fetchTendor = await TendorList.find({}).sort({ createdAt: -1 });

    if (!fetchTendor || fetchTendor.length === 0) {
      return res.status(400).json({
        result: "false",
        msg: "No data found for Tendor List!",
      });
    }

    res.status(200).json({
      result: "true",
      msg: "All Tendor list for type Company",
      data: fetchTendor,
    });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message,
    });
  }
};

const getTendorDetailById = async (req, res) => {
  try {
    const { id } = req.query;

    const tendor = await TendorList.findById(id);

    if (!tendor) {
      return res.status(404).json({
        result: "false",
        msg: "Tendor not found with the given ID!",
      });
    }

    res.status(200).json({
      result: "true",
      msg: "Tendor details fetched successfully",
      data: tendor,
    });
  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message,
    });
  }
};

const AddBusinessBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, image",
      });
    }

    const bann = new BussinessBanner({
      title,
      image,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Business Banner Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin banner",
      error: error.message,
    });
  }
};

const AddCompanyBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, image",
      });
    }

    const bann = new CompanyBanner({
      title,
      image,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Company Banner Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin banner",
      error: error.message,
    });
  }
};

const AddIndividualBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, image",
      });
    }

    const bann = new IndividualBanner({
      title,
      image,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Individual Banner Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin banner",
      error: error.message,
    });
  }
};

const GetBusinessBanner = async (req, res) => {
  try {
    const fatchbanner = await BussinessBanner.find().sort({ _id: -1 });

    if (!fatchbanner || fatchbanner.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No banner found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Business Banner List",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const GetCompanyBanner = async (req, res) => {
  try {
    const fatchbanner = await CompanyBanner.find().sort({ _id: -1 });

    if (!fatchbanner || fatchbanner.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No banner found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Company Banner List",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const GetIndividualBanner = async (req, res) => {
  try {
    const fatchbanner = await IndividualBanner.find().sort({ _id: -1 });

    if (!fatchbanner || fatchbanner.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No banner found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Individual Banner List",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const UpdateBusinessBanner = async (req, res) => {
  try {
    const { bannerId, title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId, optional( title, image )",
      });
    }

    const fatchbanner = await BussinessBanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Bussiness Banner Not Found!",
      });
    }

    if (title) fatchbanner.title = title;
    if (image) fatchbanner.image = image;
    await fatchbanner.save();

    res.status(200).json({
      result: true,
      msg: "Bussiness Banner Updated Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin banner",
      error: error.message,
    });
  }
};

const UpdateCompanyBanner = async (req, res) => {
  try {
    const { bannerId, title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId, optional( title, image )",
      });
    }

    const fatchbanner = await CompanyBanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Company Banner Not Found!",
      });
    }

    if (title) fatchbanner.title = title;
    if (image) fatchbanner.image = image;
    await fatchbanner.save();

    res.status(200).json({
      result: true,
      msg: "Company Banner Updated Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin banner",
      error: error.message,
    });
  }
};

const UpdateIndividualBanner = async (req, res) => {
  try {
    const { bannerId, title } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId, optional( title, image )",
      });
    }

    const fatchbanner = await IndividualBanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Individual Banner Not Found!",
      });
    }

    if (title) fatchbanner.title = title;
    if (image) fatchbanner.image = image;
    await fatchbanner.save();

    res.status(200).json({
      result: true,
      msg: "Individual Banner Updated Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin banner",
      error: error.message,
    });
  }
};

const DeleteBusinessBanner = async (req, res) => {
  try {
    const { bannerId } = req.body;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await BussinessBanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Banner Not Found!",
      });
    }

    await BussinessBanner.findByIdAndDelete(bannerId);

    res.status(200).json({
      result: true,
      msg: "Business Banner Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting bussiness banner",
      error: error.message,
    });
  }
};

const DeleteCompanyBanner = async (req, res) => {
  try {
    const { bannerId } = req.body;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await CompanyBanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Banner Not Found!",
      });
    }

    await CompanyBanner.findByIdAndDelete(bannerId);

    res.status(200).json({
      result: true,
      msg: "Company Banner Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting company banner",
      error: error.message,
    });
  }
};

const DeleteIndividualBanner = async (req, res) => {
  try {
    const { bannerId } = req.body;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await IndividualBanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Banner Not Found!",
      });
    }

    await IndividualBanner.findByIdAndDelete(bannerId);

    res.status(200).json({
      result: true,
      msg: "Individual Banner Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting individual banner",
      error: error.message,
    });
  }
};

const BusinessBannerDetails = async (req, res) => {
  try {
    const { bannerId } = req.params;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await BussinessBanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Banner Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Business Banner Details Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details bussiness banner",
      error: error.message,
    });
  }
};

const CompanyBannerDetails = async (req, res) => {
  try {
    const { bannerId } = req.params;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await CompanyBanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Banner Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Company Banner Details Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details company banner",
      error: error.message,
    });
  }
};

const IndividualBannerDetails = async (req, res) => {
  try {
    const { bannerId } = req.params;

    if (!bannerId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: bannerId",
      });
    }

    const fatchbanner = await IndividualBanner.findById(bannerId);
    if (!fatchbanner) {
      return res.status(404).json({
        result: false,
        msg: "Banner Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Individual Banner Details Successfully",
      data: fatchbanner,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details individual banner",
      error: error.message,
    });
  }
};

const AdmincategorymainPower = async (req, res) => {
  try {
    const { name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!name || !image) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: name, image",
      });
    }

    const cate = new Power_Cat({
      name,
      image,
    });

    await cate.save();

    res.status(200).json({
      result: true,
      msg: "Admin Main Power Category Added Successfully",
      data: cate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding Power admin category",
      error: error.message,
    });
  }
};

const AdminSubcategorymainPowerAdd = async (req, res) => {
  try {
    const { power_category_id, sub_cate_name } = req.body;
    const mainsub_cat_image =
      req.files && req.files.mainsub_cat_image
        ? req.files.mainsub_cat_image[0].filename
        : null;

    if (!power_category_id || !sub_cate_name) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: power_category_id, sub_cate_name",
      });
    }

    if (!mainsub_cat_image) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: mainsub_cat_image",
      });
    }

    const Subcate = new Power_Cat_Sub({
      power_category_id,
      sub_cate_name,
      mainsub_cat_image,
    });

    await Subcate.save();

    res.status(200).json({
      result: true,
      msg: "Admin Sub Category Added Successfully",
      data: Subcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding sub category",
      error: error.message,
    });
  }
};

const AllmainPowercategoryFatch = async (req, res) => {
  try {
    const fatchcate = await Power_Cat.find().sort({ _id: -1 });

    if (!fatchcate || fatchcate.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No Main Power categories found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Main Power Category List",
      data: fatchcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const AdminSubcategoryListmainPower = async (req, res) => {
  try {
    const subcategories = await Power_Cat_Sub.find()
      .sort({ _id: -1 })
      .populate("power_category_id", "name")
      .exec();

    res.status(200).json({
      result: true,
      msg: "Subcategories fetched successfully",
      path: BASE_URL + "uploads/admin/",
      data: subcategories,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching subcategories",
      error: error.message,
    });
  }
};

const AddFreelancerHeadline = async (req, res) => {
  try {
    const { headline, subheadline } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!headline || !subheadline) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: headline, subheadline, image",
      });
    }

    const bann = new FreelancerHeadline({
      headline,
      subheadline,
      image,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Freelancer Headline Page Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin headline",
      error: error.message,
    });
  }
};

// suraj

const GetFreelancerHeadline = async (req, res) => {
  try {
    const headlineData = await FreelancerHeadline.findOne();
    if (!headlineData) {
      return res
        .status(404)
        .json({ result: false, msg: "Freelancer Headline not found" });
    }
    res.status(200).json({
      result: true,
      msg: "Freelancer Headline fetched successfully",
      data: headlineData,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching freelancer headline",
      error: error.message,
    });
  }
};

const GetBusinessHeadline = async (req, res) => {
  try {
    const headlineData = await BusinessHeadline.findOne();
    if (!headlineData) {
      return res
        .status(404)
        .json({ result: false, msg: "Business Headline not found" });
    }
    res.status(200).json({
      result: true,
      msg: "Business Headline fetched successfully",
      data: headlineData,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching business headline",
      error: error.message,
    });
  }
};

const GetCompanyHeadline = async (req, res) => {
  try {
    const headlineData = await CompanyHeadline.findOne();
    if (!headlineData) {
      return res
        .status(404)
        .json({ result: false, msg: "Company Headline not found" });
    }
    res.status(200).json({
      result: true,
      msg: "Company Headline fetched successfully",
      data: headlineData,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching company headline",
      error: error.message,
    });
  }
};

const GetIndividualHeadline = async (req, res) => {
  try {
    const headlineData = await IndividualHeadline.findOne();
    if (!headlineData) {
      return res
        .status(404)
        .json({ result: false, msg: "Individual Headline not found" });
    }
    res.status(200).json({
      result: true,
      msg: "Individual Headline fetched successfully",
      data: headlineData,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching individual headline",
      error: error.message,
    });
  }
};

const AddOrUpdateFreelancerHeadline = async (req, res) => {
  try {
    const { headline, subheadline } = req.body;

    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!headline || !subheadline) {
      return res.status(400).json({
        result: false,
        msg: "Parameters required: headline, subheadline, image",
      });
    }

    // Check if a headline already exists
    let existing = await FreelancerHeadline.findOne();

    if (existing) {
      // Update existing
      existing.headline = headline;
      existing.subheadline = subheadline;
      if (image) existing.image = image;

      await existing.save();

      return res.status(200).json({
        result: true,
        msg: "Freelancer Headline updated successfully",
        data: existing,
      });
    } else {
      // Create new
      const newHeadline = new FreelancerHeadline({
        headline,
        subheadline,
        image,
      });

      await newHeadline.save();

      return res.status(200).json({
        result: true,
        msg: "Freelancer Headline added successfully",
        data: newHeadline,
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Error processing freelancer headline",
      error: error.message,
    });
  }
};

const AddOrUpdateBusinessHeadline = async (req, res) => {
  try {
    const { headline, subheadline } = req.body;

    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!headline || !subheadline) {
      return res.status(400).json({
        result: false,
        msg: "Parameters required: headline, subheadline, image",
      });
    }

    // Check if a headline already exists
    let existing = await BusinessHeadline.findOne();

    if (existing) {
      // Update existing
      existing.headline = headline;
      existing.subheadline = subheadline;
      if (image) existing.image = image;

      await existing.save();

      return res.status(200).json({
        result: true,
        msg: "Business Headline updated successfully",
        data: existing,
      });
    } else {
      // Create new
      const newHeadline = new BusinessHeadline({
        headline,
        subheadline,
        image,
      });

      await newHeadline.save();

      return res.status(200).json({
        result: true,
        msg: "Business Headline added successfully",
        data: newHeadline,
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Error processing Business headline",
      error: error.message,
    });
  }
};

const AddOrUpdateCompanyHeadline = async (req, res) => {
  try {
    const { headline, subheadline } = req.body;

    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!headline || !subheadline) {
      return res.status(400).json({
        result: false,
        msg: "Parameters required: headline, subheadline, image",
      });
    }

    // Check if a headline already exists
    let existing = await CompanyHeadline.findOne();

    if (existing) {
      // Update existing
      existing.headline = headline;
      existing.subheadline = subheadline;
      if (image) existing.image = image;

      await existing.save();

      return res.status(200).json({
        result: true,
        msg: "Company Headline updated successfully",
        data: existing,
      });
    } else {
      // Create new
      const newHeadline = new CompanyHeadline({
        headline,
        subheadline,
        image,
      });

      await newHeadline.save();

      return res.status(200).json({
        result: true,
        msg: "Company Headline added successfully",
        data: newHeadline,
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Error processing Company headline",
      error: error.message,
    });
  }
};

const AddOrUpdateIndividualHeadline = async (req, res) => {
  try {
    const { headline, subheadline } = req.body;

    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!headline || !subheadline) {
      return res.status(400).json({
        result: false,
        msg: "Parameters required: headline, subheadline, image",
      });
    }

    // Check if a headline already exists
    let existing = await IndividualHeadline.findOne();

    if (existing) {
      // Update existing
      existing.headline = headline;
      existing.subheadline = subheadline;
      if (image) existing.image = image;

      await existing.save();

      return res.status(200).json({
        result: true,
        msg: "Individual Headline updated successfully",
        data: existing,
      });
    } else {
      // Create new
      const newHeadline = new IndividualHeadline({
        headline,
        subheadline,
        image,
      });

      await newHeadline.save();

      return res.status(200).json({
        result: true,
        msg: "Individual Headline added successfully",
        data: newHeadline,
      });
    }
  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Error processing Business headline",
      error: error.message,
    });
  }
};

// suraj

const AddBusinessHeadline = async (req, res) => {
  try {
    const { headline, subheadline } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!headline || !subheadline) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: headline, subheadline, image",
      });
    }

    const bann = new BusinessHeadline({
      headline,
      subheadline,
      image,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Business Headline Page Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin headline",
      error: error.message,
    });
  }
};

const AddCompanyHeadline = async (req, res) => {
  try {
    const { headline, subheadline } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!headline || !subheadline) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: headline, subheadline, image",
      });
    }

    const bann = new CompanyHeadline({
      headline,
      subheadline,
      image,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Company Headline Page Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin headline",
      error: error.message,
    });
  }
};

const AddIndividualHeadline = async (req, res) => {
  try {
    const { headline, subheadline } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!headline || !subheadline) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: headline, subheadline, image",
      });
    }

    const bann = new IndividualHeadline({
      headline,
      subheadline,
      image,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Individual Headline Page Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin headline",
      error: error.message,
    });
  }
};

const AddFreelancerBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const icon =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title || !description) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, description",
      });
    }

    const bann = new FreelancerBenefit({
      title,
      description,
      icon,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Freelancer Benefit Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin benefit",
      error: error.message,
    });
  }
};

const AddBusinessBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const icon =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title || !description) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, description",
      });
    }

    const bann = new BusinessBenefit({
      title,
      description,
      icon,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Business Benefit Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin benefit",
      error: error.message,
    });
  }
};

const AddCompanyBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const icon =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title || !description) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, description",
      });
    }

    const bann = new CompanyBenefit({
      title,
      description,
      icon,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Company Benefit Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin benefit",
      error: error.message,
    });
  }
};

const AddIndividualBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const icon =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!title || !description) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, description",
      });
    }

    const bann = new IndividualBenefit({
      title,
      description,
      icon,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Individual Benefit Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin benefit",
      error: error.message,
    });
  }
};

const AddFreelancerWork = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: title, description",
      });
    }

    const bann = new FreelancerWork({
      title,
      description,
    });

    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Freelancer Work Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin work",
      error: error.message,
    });
  }
};

// Suraj controller start

// Create Role

const getAllFreelancerBenefits = async (req, res) => {
  try {
    const benefits = await FreelancerBenefit.find();
    res
      .status(200)
      .json({ result: true, msg: "Freelancer Benefits List", data: benefits });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching Freelancer Benefits",
      error: error.message,
    });
  }
};

const getFreelancerBenefitById = async (req, res) => {
  try {
    const benefit = await FreelancerBenefit.findById(req.query.id);
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Freelancer Benefit not found" });
    res
      .status(200)
      .json({ result: true, msg: "Freelancer Benefit Detail", data: benefit });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching Freelancer Benefit",
      error: error.message,
    });
  }
};

const updateFreelancerBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const icon =
      req.files && req.files.image ? req.files.image[0].filename : null;

    const benefit = await FreelancerBenefit.findByIdAndUpdate(
      req.query.id,
      { title, description, icon },
      { new: true }
    );
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Freelancer Benefit not found" });
    res
      .status(200)
      .json({ result: true, msg: "Freelancer Benefit updated", data: benefit });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating Freelancer Benefit",
      error: error.message,
    });
  }
};

const deleteFreelancerBenefit = async (req, res) => {
  try {
    const benefit = await FreelancerBenefit.findByIdAndDelete(req.query.id);
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Freelancer Benefit not found" });
    res
      .status(200)
      .json({ result: true, msg: "Freelancer Benefit deleted", data: benefit });
    res.status(200).json({ result: true, msg: "Freelancer Benefit deleted" });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting Freelancer Benefit",
      error: error.message,
    });
  }
};

const getAllBusinessBenefits = async (req, res) => {
  try {
    const benefits = await BusinessBenefit.find();
    res
      .status(200)
      .json({ result: true, msg: "Business Benefits List", data: benefits });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching Business Benefits",
      error: error.message,
    });
  }
};

const getBusinessBenefitById = async (req, res) => {
  try {
    const benefit = await BusinessBenefit.findById(req.query.id);
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Business Benefit not found" });
    res
      .status(200)
      .json({ result: true, msg: "Business Benefit Detail", data: benefit });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching Business Benefit",
      error: error.message,
    });
  }
};

const updateBusinessBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const icon =
      req.files && req.files.image ? req.files.image[0].filename : null;

    const benefit = await BusinessBenefit.findByIdAndUpdate(
      req.query.id,
      { title, description, icon },
      { new: true }
    );
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Business Benefit not found" });
    res
      .status(200)
      .json({ result: true, msg: "Business Benefit updated", data: benefit });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating Business Benefit",
      error: error.message,
    });
  }
};

const deleteBusinessBenefit = async (req, res) => {
  try {
    const benefit = await BusinessBenefit.findByIdAndDelete(req.query.id);
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Business Benefit not found" });
    res.status(200).json({ result: true, msg: "Business Benefit deleted" });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting Business Benefit",
      error: error.message,
    });
  }
};

const getAllCompanyBenefits = async (req, res) => {
  try {
    const benefits = await CompanyBenefit.find();
    res
      .status(200)
      .json({ result: true, msg: "Company Benefits List", data: benefits });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching Company Benefits",
      error: error.message,
    });
  }
};

const getCompanyBenefitById = async (req, res) => {
  try {
    const benefit = await CompanyBenefit.findById(req.query.id);
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Company Benefit not found" });
    res
      .status(200)
      .json({ result: true, msg: "Company Benefit Detail", data: benefit });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching Company Benefit",
      error: error.message,
    });
  }
};

const updateCompanyBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const icon =
      req.files && req.files.image ? req.files.image[0].filename : null;

    const benefit = await CompanyBenefit.findByIdAndUpdate(
      req.query.id,
      { title, description, icon },
      { new: true }
    );
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Company Benefit not found" });
    res
      .status(200)
      .json({ result: true, msg: "Company Benefit updated", data: benefit });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating Company Benefit",
      error: error.message,
    });
  }
};

const deleteCompanyBenefit = async (req, res) => {
  try {
    const benefit = await CompanyBenefit.findByIdAndDelete(req.query.id);
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Company Benefit not found" });
    res.status(200).json({ result: true, msg: "Company Benefit deleted" });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting Company Benefit",
      error: error.message,
    });
  }
};

const getAllIndividualBenefits = async (req, res) => {
  try {
    const benefits = await IndividualBenefit.find();
    res
      .status(200)
      .json({ result: true, msg: "Individual Benefits List", data: benefits });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching Individual Benefits",
      error: error.message,
    });
  }
};

const getIndividualBenefitById = async (req, res) => {
  try {
    const benefit = await IndividualBenefit.findById(req.query.id);
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Individual Benefit not found" });
    res
      .status(200)
      .json({ result: true, msg: "Individual Benefit Detail", data: benefit });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error fetching Individual Benefit",
      error: error.message,
    });
  }
};

const updateIndividualBenefit = async (req, res) => {
  try {
    const { title, description } = req.body;
    const icon =
      req.files && req.files.image ? req.files.image[0].filename : null;

    const benefit = await IndividualBenefit.findByIdAndUpdate(
      req.query.id,
      { title, description, icon },
      { new: true }
    );
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Individual Benefit not found" });
    res
      .status(200)
      .json({ result: true, msg: "Individual Benefit updated", data: benefit });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating Individual Benefit",
      error: error.message,
    });
  }
};

const deleteIndividualBenefit = async (req, res) => {
  try {
    const benefit = await IndividualBenefit.findByIdAndDelete(req.query.id);
    if (!benefit)
      return res
        .status(404)
        .json({ result: false, msg: "Individual Benefit not found" });
    res.status(200).json({ result: true, msg: "Individual Benefit deleted" });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting Individual Benefit",
      error: error.message,
    });
  }
};

const createRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: "Role is required" });

    const newRole = await adminRoles.create({ role });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await adminRoles.find().sort({ createdAt: -1 });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Role by ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.query;
    const role = await adminRoles.findById(id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Role
const updateRole = async (req, res) => {
  try {
    const { role, id } = req.body;

    const updatedRole = await adminRoles.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!updatedRole)
      return res.status(404).json({ message: "Role not found" });

    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Role
const deleteRole = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedRole = await adminRoles.findByIdAndDelete(id);

    if (!deletedRole)
      return res.status(404).json({ message: "Role not found" });

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    const existingAdmin = await subAdmins.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newAdmin = await subAdmins.create({
      name,
      email,
      password,
      role,
      permissions,
    });

    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the admin with the given email
    const admin = await subAdmins.findOne({ email }).populate("role");

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // 2. Decrypt stored password
    const bytes = CryptoJS.AES.decrypt(admin.password, process.env.SECRET_KEY);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    // 3. Compare passwords
    if (decryptedPassword !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Create JWT
    const token = jwt.sign(
      {
        _id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, admin });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server error", error: err.message });
  }
};
/*******  7f653418-484e-43aa-9447-042be13102c5  *******/

// Get All Admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await subAdmins.find().populate("role");

    // 🔓 Decrypt password for each admin
    const adminsWithDecryptedPasswords = admins.map((admin) => {
      const bytes = CryptoJS.AES.decrypt(
        admin.password,
        process.env.SECRET_KEY
      );
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

      return {
        ...admin.toObject(),
        password: decryptedPassword,
      };
    });

    res.status(200).json(adminsWithDecryptedPasswords);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await subAdmins.findById(req.query.id).populate("role");

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // 🔓 Decrypt the password
    const bytes = CryptoJS.AES.decrypt(admin.password, process.env.SECRET_KEY);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    // 🛠️ Return decrypted password in the response
    const adminWithDecryptedPassword = {
      ...admin.toObject(),
      password: decryptedPassword,
    };

    res.status(200).json(adminWithDecryptedPassword);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Admin
const updateAdmin = async (req, res) => {
  try {
    const { name, email, password, role, permissions, isActive } = req.body;

    const updateData = { name, email, role, permissions, isActive };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await subAdmins.findByIdAndUpdate(
      req.query.id,
      updateData,
      { new: true }
    );

    if (!updatedAdmin)
      return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(updatedAdmin);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const deleted = await subAdmins.findByIdAndDelete(req.query.id);
    if (!deleted) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const updateTopFreelancerStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    const user = await Auth.findById(userId);

    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "Freelancer not found",
      });
    }

    user.topFreelancer = status;
    await user.save();

    res.status(200).json({
      result: true,
      msg: `Top freelancer status updated to ${status}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Failed to update status",
      error: error.message,
    });
  }
};



const CreateJobPositionCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!name) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: name, image",
      });
    }

    const bann = new jobPositionCategory({
      name,
      image,
    });
    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Category Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin market category",
      error: error.message,
    });
  }
};

const getAllJobPositionCategory = async (req, res) => {
  try {
    const fatchcate = await jobPositionCategory.find().sort({ _id: -1 });

    if (!fatchcate || fatchcate.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No service categories found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Service Category List",
      data: fatchcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const UpdateJobPositionCategory = async (req, res) => {
  try {
    const { id, name } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!id) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: id, optional( name, image )",
      });
    }

    const fatchmarket = await jobPositionCategory.findById(id);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Category Not Found!",
      });
    }

    if (name) fatchmarket.name = name;
    if (image) fatchmarket.image = image;
    await fatchmarket.save();

    res.status(200).json({
      result: true,
      msg: "Category Updated Successfully",
      data: fatchmarket,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin category",
      error: error.message,
    });
  }
};

const JobPositionCategoryDetails = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: id",
      });
    }

    const fatchmarket = await jobPositionCategory.findById(id);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Category Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Category Details Successfully",
      data: fatchmarket,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin category",
      error: error.message,
    });
  }
};

const DeleteJobPositionCategory = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: id",
      });
    }

    const fatchmarket = await jobPositionCategory.findById(id);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Market Category Not Found!",
      });
    }

    await jobPositionCategory.findByIdAndDelete(id);

    res.status(200).json({
      result: true,
      msg: "Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin category",
      error: error.message,
    });
  }
};



const CreateJobPositionSubCategory = async (req, res) => {
  try {
    const { name, jobPositionCategoryId } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;

    if (!name) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: name, image",
      });
    }

    const bann = new jobPositionSubCategory({
      name,
      image,
      jobPositionCategoryId,
    });
    await bann.save();

    res.status(200).json({
      result: true,
      msg: "Category Added Successfully",
      data: bann,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding admin market category",
      error: error.message,
    });
  }
};

const getAllJobPositionSubCategory = async (req, res) => {
  try {
    const fatchcate = await jobPositionSubCategory.find().sort({ _id: -1 });

    if (!fatchcate || fatchcate.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No service categories found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Service Category List",
      data: fatchcate,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const UpdateJobPositionSubCategory = async (req, res) => {
  try {
    const { id, name, jobPositionCategoryId } = req.body;
    const image =
      req.files && req.files.image ? req.files.image[0].filename : null;
    if (!id) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: id, optional( name, image )",
      });
    }

    const fatchmarket = await jobPositionSubCategory.findById(id);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Category Not Found!",
      });
    }

    if (name) fatchmarket.name = name;
    if (image) fatchmarket.image = image;
    if (jobPositionCategoryId) fatchmarket.jobPositionCategoryId = jobPositionCategoryId;
    await fatchmarket.save();

    res.status(200).json({
      result: true,
      msg: "Category Updated Successfully",
      data: fatchmarket,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating admin category",
      error: error.message,
    });
  }
};

const JobPositionSubCategoryDetails = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: id",
      });
    }

    const fatchmarket = await jobPositionSubCategory.findById(id);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Service Category Not Found!",
      });
    }

    res.status(200).json({
      result: true,
      msg: "Admin Service Category Details Successfully",
      data: fatchmarket,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error details admin category",
      error: error.message,
    });
  }
};

const DeleteJobPositionSubCategory = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: id",
      });
    }

    const fatchmarket = await jobPositionSubCategory.findById(id);
    if (!fatchmarket) {
      return res.status(404).json({
        result: false,
        msg: "Market Category Not Found!",
      });
    }

    await jobPositionSubCategory.findByIdAndDelete(id);

    res.status(200).json({
      result: true,
      msg: "Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error deleting admin category",
      error: error.message,
    });
  }
};





// Suraj controller end

module.exports = {
  getAboutUS,
  updateAboutUS,
  getTermscondition,
  getfaqlist,
  updatefaqs,
  updateTermscondition,
  getprivacyPolicy,
  updateprivacyPolicy,
  AdminLogin,
  logoutAdmin,
  AdmincategoryAddFreelancer,
  AdminBlogsAdd,
  AdminBannerAdd,
  AllcategoryFatch,
  AllbanneryFatch,
  AllblogsFatch,
  AdminskillsAdd,
  AllskillsFatch,
  AdmincategoryjobAdd,
  AdmincategoryUpdate,
  AdmincategoryFreelancerDetails,
  AdmincategoryDelete,
  AdminSubcategoryFreelancerAdd,
  AdminSubcategoryList,
  AdminSubcategoryUpdate,
  AdminSubcategoryDelete,
  AdmincategoryDetails,
  AdminSubcategorydetails,
  AdminjobcategoryDetails,
  AdminjobcategoryUpdate,
  AdminjobcategoryDelete,
  AlljobcategoryFatch,
  AdminbannerDetails,
  AdminbannerUpdate,
  AdminbannerDelete,
  AdminBlogsDetails,
  AdminblogsUpdate,
  AdminblogsDelete,
  AdminskillsDetails,
  AdminskillsUpdate,
  AdminbskillDelete,
  alluserList,
  AdminfreelancerBannerAdd,
  AllfreelancerbanneryFatch,
  AdminfreelancerbannerUpdate,
  AdminfreelancerbannerDetails,
  AdminfreelancerbannerDelete,
  AdminmarketCategoryAdd,
  AllmarketcategoryFatch,
  AdminmarketcategoryUpdate,
  AdminmarketcategoryDetails,
  AdminmarketcategoryDelete,
  AdminserviceCategoryAdd,
  AllservicecategoryFatch,
  AdminservicecategoryUpdate,
  AdminservicecategoryDetails,
  AdminservicecategoryDelete,
  usercloseAccount,
  AdminmarketplaceBannerAdd,
  AllmarketplacebanneryFatch,
  AdminmarketplacebannerUpdate,
  AdminmarketplacebannerDetails,
  AdminmarketplacebannerDelete,
  allCompanygetjobList,
  AdminJobDetails,
  Adminmarketplaceskilledadd,
  AllmarketplaceskilledFatch,
  AdminmarketplaceskilledUpdate,
  AdminmarketplaceskilledDetails,
  AdminmarketplaceskilledDelete,
  AdminmarkettoolsEquipment,
  alleuipmenttoolslist,
  marketeuipmenttoolsdetails,
  AdminmarkettoolsequipmentUpdate,
  AdminmarkettoolsequipmentDelete,
  AdminTendorBlogsAdd,
  AllTendorblogsFatch,
  AdminTendorBlogsDetails,
  AdmintendorblogsUpdate,
  AdmintendorblogsDelete,
  addUserByAdmin,
  getUserByAdminDetails,
  AdminTendorAdd,
  getBusinessProduct,
  getBusinessService,
  getAllTendorListInAdmin,
  getTendorDetailById,
  AddBusinessBanner,
  AddCompanyBanner,
  AddIndividualBanner,
  GetBusinessBanner,
  GetCompanyBanner,
  GetIndividualBanner,
  UpdateBusinessBanner,
  UpdateCompanyBanner,
  UpdateIndividualBanner,
  DeleteBusinessBanner,
  DeleteCompanyBanner,
  DeleteIndividualBanner,
  BusinessBannerDetails,
  CompanyBannerDetails,
  IndividualBannerDetails,
  AdmincategorymainPower,
  AdminSubcategorymainPowerAdd,
  AllmainPowercategoryFatch,
  AdminSubcategoryListmainPower,
  AddFreelancerHeadline,
  AddBusinessHeadline,
  AddCompanyHeadline,
  AddIndividualHeadline,
  AddFreelancerBenefit,
  AddBusinessBenefit,
  AddCompanyBenefit,
  AddIndividualBenefit,
  AddFreelancerWork,
  createRole,
  getAllRoles,
  updateRole,
  getRoleById,
  deleteRole,
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  GetFreelancerHeadline,
  GetBusinessHeadline,
  GetCompanyHeadline,
  GetIndividualHeadline,
  AddOrUpdateFreelancerHeadline,
  AddOrUpdateBusinessHeadline,
  AddOrUpdateCompanyHeadline,
  AddOrUpdateIndividualHeadline,

  getAllFreelancerBenefits,
  getAllBusinessBenefits,
  getAllCompanyBenefits,
  getAllIndividualBenefits,
  getFreelancerBenefitById,
  getBusinessBenefitById,
  getCompanyBenefitById,
  getIndividualBenefitById,
  updateFreelancerBenefit,
  updateBusinessBenefit,
  updateCompanyBenefit,
  updateIndividualBenefit,
  deleteFreelancerBenefit,
  deleteBusinessBenefit,
  deleteCompanyBenefit,
  deleteIndividualBenefit,
  updateTopFreelancerStatus,


  CreateJobPositionCategory,
getAllJobPositionCategory,
UpdateJobPositionCategory,
JobPositionCategoryDetails,
DeleteJobPositionCategory,
CreateJobPositionSubCategory,
getAllJobPositionSubCategory,
UpdateJobPositionSubCategory,
JobPositionSubCategoryDetails,
DeleteJobPositionSubCategory,

  
};
