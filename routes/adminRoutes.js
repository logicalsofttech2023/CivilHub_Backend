
const express = require("express");
const adminController = require("../controllers/adminController");
const upload = require("../middlewares/uploadsAdmin");
const authenticateToken = require("../middlewares/adminMiddleware");
const { tendorUpload } = require("../middlewares/TenderDocUpload");


const router = express.Router();

router.post("/admin_login",adminController.AdminLogin);
router.post("/admin_logout",authenticateToken,adminController.logoutAdmin);
router.get("/get_abouts",authenticateToken,adminController.getAboutUS);
router.put("/update_about/:aboutId",authenticateToken,adminController.updateAboutUS);
router.get("/get_termscondition",authenticateToken,adminController.getTermscondition);
router.put("/update_terms/:termsId",authenticateToken,adminController.updateTermscondition);
router.get("/get_privacy",authenticateToken,adminController.getprivacyPolicy);
router.put("/update_privacy/:privacyId",authenticateToken,adminController.updateprivacyPolicy);
router.get("/get_faq",authenticateToken,adminController.getfaqlist );
router.put("/update_faq/:faqId",authenticateToken,adminController.updatefaqs);
router.post("/admin_freelanceradd_category",authenticateToken,adminController.AdmincategoryAddFreelancer);
router.get("/admin_all_category_freelancer",authenticateToken,adminController.AllcategoryFatch);
router.post("/admin_update_category_freelancer",authenticateToken,adminController.AdmincategoryUpdate);
router.get("/admin_category_freelancer_details/:categoryId",authenticateToken,adminController.AdmincategoryFreelancerDetails);
router.post("/admin_delete_category_freelancer",authenticateToken,adminController.AdmincategoryDelete);

router.post("/admin_add_cate_job",upload.fields([{ name:"image", maxCount: 1}]),authenticateToken,adminController.AdmincategoryjobAdd);
router.post("/admin_add_blogs",upload.fields([{name: "image", maxCount: 1}]),authenticateToken,adminController.AdminBlogsAdd);
router.post("/admin_add_banner",upload.fields([{name: "image", maxCount: 1}]),authenticateToken,adminController.AdminBannerAdd);
router.get("/admin_all_banner",authenticateToken,adminController.AllbanneryFatch);
router.get("/admin_all_blogs",authenticateToken,adminController.AllblogsFatch);
router.post("/admin_add_skills",authenticateToken,adminController.AdminskillsAdd);
router.get("/admin_all_skills",authenticateToken,adminController.AllskillsFatch);
router.get("/admin_skill_details/:skillId",authenticateToken,adminController.AdminskillsDetails);
router.post("/admin_skill_update",authenticateToken,adminController.AdminskillsUpdate);
router.post("/admin_skill_delete",authenticateToken,adminController.AdminbskillDelete);
router.post("/admin_addfreelancer_subcategoy",upload.fields([{ name: "sub_cat_image", maxCount: 1}]),authenticateToken,adminController.AdminSubcategoryFreelancerAdd);
router.get("/admin_all_sub_cate_free",authenticateToken,adminController.AdminSubcategoryList);
router.post("/admin_update_subcategory_free",upload.fields([{ name: "sub_cat_image", maxCount: 1}]),authenticateToken,adminController.AdminSubcategoryUpdate);
router.post("/admin_delete_subcate_free",authenticateToken,adminController.AdminSubcategoryDelete);
router.get("/admin_cate_details/:categoryId",authenticateToken,adminController.AdmincategoryDetails);
router.get("/admin_subcate_details_free/:subcatId",authenticateToken,adminController.AdminSubcategorydetails);
router.get("/admin_jobcate_details/:jobcategoryId",authenticateToken,adminController.AdminjobcategoryDetails);
router.post("/admin_jobcate_update",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.AdminjobcategoryUpdate);
router.post("/admin_jobcate_delete",authenticateToken,adminController.AdminjobcategoryDelete);
router.get("/admin_all_jobcate",authenticateToken,adminController.AlljobcategoryFatch);
router.get("/admin_banner_details/:bannerId",authenticateToken,adminController.AdminbannerDetails);
router.post("/admin_update_banner",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.AdminbannerUpdate);
router.post("/admin_delete_banner",authenticateToken,adminController.AdminbannerDelete);
router.get("/admin_blogs_details/:blogId",authenticateToken,adminController.AdminBlogsDetails);
router.post("/admin_blogs_update",upload.fields([{ name: "image", maxCount: 1 }]),authenticateToken,adminController.AdminblogsUpdate);
router.post("/admin_blogs_delete",authenticateToken,adminController.AdminblogsDelete);
router.get("/all_user_list",authenticateToken,adminController.alluserList);
router.post("/add_freelancer_banner",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.AdminfreelancerBannerAdd);
router.get("/freelancer_all_banner",authenticateToken,adminController.AllfreelancerbanneryFatch);
router.post("/update_freelancer_banner",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.AdminfreelancerbannerUpdate);
router.get("/freelancer_banner_details/:bannerId",authenticateToken,adminController.AdminfreelancerbannerDetails);
router.post("/freelancer_banner_delete",authenticateToken,adminController.AdminfreelancerbannerDelete);
router.post("/add_market_category",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.AdminmarketCategoryAdd);
router.get("/all_market_category",authenticateToken,adminController.AllmarketcategoryFatch);
router.post("/update_market_category",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.AdminmarketcategoryUpdate);
router.get("/market_category_details/:categoryId",authenticateToken,adminController.AdminmarketcategoryDetails);
router.post("/market_category_delete",authenticateToken,adminController.AdminmarketcategoryDelete);

router.post("/add_service_category",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.AdminserviceCategoryAdd);
router.get("/all_service_category",authenticateToken,adminController.AllservicecategoryFatch);
router.post("/update_service_category",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.AdminservicecategoryUpdate);
router.get("/service_category_details/:categoryId",authenticateToken,adminController.AdminservicecategoryDetails);
router.post("/service_category_delete",authenticateToken,adminController.AdminservicecategoryDelete);

router.post("/user_account_block_unblock",authenticateToken,adminController.usercloseAccount);
router.post("/add_market_banner",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.AdminmarketplaceBannerAdd);
router.get("/all_market_banner",authenticateToken,adminController.AllmarketplacebanneryFatch);
router.post("/update_market_banner",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.AdminmarketplacebannerUpdate);
router.get("/market_banner_details/:bannerId",authenticateToken,adminController.AdminmarketplacebannerDetails);
router.post("/market_banner_delete",authenticateToken,adminController.AdminmarketplacebannerDelete);
router.get("/all_job_list",authenticateToken,adminController.allCompanygetjobList);

router.get("/admin_job_details/:jobId",authenticateToken,adminController.AdminJobDetails);

router.post("/add_market_place_skilled",upload.fields([{ name: "image", maxCount: 1 }]),authenticateToken,adminController.Adminmarketplaceskilledadd);
router.get("/all_market_skilled",authenticateToken,adminController.AllmarketplaceskilledFatch);
router.post("/update_market_skilled",upload.fields([{ name: "image", maxCount: 1 }]),authenticateToken,adminController.AdminmarketplaceskilledUpdate);
router.get("/market_skilled_details/:skillId",authenticateToken,adminController.AdminmarketplaceskilledDetails);
router.post("/market_skilled_delete",authenticateToken,adminController.AdminmarketplaceskilledDelete);
router.post("/add_market_tools_equipment",upload.fields([{ name: "image", maxCount: 1 }]),authenticateToken,adminController.AdminmarkettoolsEquipment);
router.get("/all_equipment_tools",authenticateToken,adminController.alleuipmenttoolslist);
router.post("/euipment_tools_details",authenticateToken,adminController.marketeuipmenttoolsdetails);
router.post("/update_market_tools_equipment",upload.fields([{ name: "image", maxCount: 1 }]),authenticateToken,adminController.AdminmarkettoolsequipmentUpdate);
router.post("/market_equipment_delete",authenticateToken,adminController.AdminmarkettoolsequipmentDelete);
router.post("/admin_add_tendor_blogs",upload.fields([{name: "image", maxCount: 1}]),authenticateToken,adminController.AdminTendorBlogsAdd);
router.get("/admin_all_tendor_blogs",authenticateToken,adminController.AllTendorblogsFatch);
router.get("/admin_tendor_blogs_details/:blogId",authenticateToken,adminController.AdminTendorBlogsDetails);
router.post("/admin_tendor_blogs_update",upload.fields([{ name: "image", maxCount: 1 }]),authenticateToken,adminController.AdmintendorblogsUpdate);
router.post("/admin_tendor_blogs_delete",authenticateToken,adminController.AdmintendorblogsDelete);
router.post(
  "/add_user_by_admin",
  upload.fields([
    { name: "profile_image", maxCount: 10 },
    { name: "banner_image", maxCount: 10 },
    { name: "id_proof", maxCount: 10 },
    { name: "resume_file", maxCount: 10 },
    { name: "panCard", maxCount: 10 },
    { name: "gstCertificate", maxCount: 10 },
  ]),
  authenticateToken,
  adminController.addUserByAdmin
);

router.get("/get_user_by_admin_details/:userId",authenticateToken,adminController.getUserByAdminDetails);

router.post(
  "/admin_add_tendor",
  tendorUpload,
  authenticateToken,
  adminController.AdminTendorAdd
);
router.get("/get_business_product",authenticateToken,adminController.getBusinessProduct);
router.get("/get_business_service",authenticateToken,adminController.getBusinessService);
router.get(
  "/getAllTendorListInAdmin",
  authenticateToken,
  adminController.getAllTendorListInAdmin
);


router.get(
  "/getTendorDetailById",
  authenticateToken,
  adminController.getTendorDetailById
);

router.post("/add_business_banner",upload.fields([{name: "image", maxCount: 1}]),authenticateToken,adminController.AddBusinessBanner);
router.post("/add_company_banner",upload.fields([{name: "image", maxCount: 1}]),authenticateToken,adminController.AddCompanyBanner);
router.post("/add_individual_banner",upload.fields([{name: "image", maxCount: 1}]),authenticateToken,adminController.AddIndividualBanner);
router.get("/get_business_banner",authenticateToken,adminController.GetBusinessBanner);
router.get("/get_company_banner",authenticateToken,adminController.GetCompanyBanner);
router.get("/get_individual_banner",authenticateToken,adminController.GetIndividualBanner);
router.post("/update_business_banner",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.UpdateBusinessBanner);
router.post("/update_company_banner",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.UpdateCompanyBanner);
router.post("/update_individual_banner",upload.fields([{ name: "image", maxCount: 1}]),authenticateToken,adminController.UpdateIndividualBanner);
router.post("/delete_business_banner",authenticateToken,adminController.DeleteBusinessBanner);
router.post("/delete_company_banner",authenticateToken,adminController.DeleteCompanyBanner);
router.post("/delete_individual_banner",authenticateToken,adminController.DeleteIndividualBanner);
router.get("/business_banner_details/:bannerId",authenticateToken,adminController.BusinessBannerDetails);
router.get("/company_banner_details/:bannerId",authenticateToken,adminController.CompanyBannerDetails);
router.get("/individual_banner_details/:bannerId",authenticateToken,adminController.IndividualBannerDetails);
router.post("/admin_add_cate_main_power",upload.fields([{ name:"image", maxCount: 1}]),authenticateToken,adminController.AdmincategorymainPower);
router.post("/admin_addmain_power_subcategoy",upload.fields([{ name: "mainsub_cat_image", maxCount: 1}]),authenticateToken,adminController.AdminSubcategorymainPowerAdd);
router.get("/all_main_power_category",authenticateToken,adminController.AllmainPowercategoryFatch);
router.get("/admin_all_sub_cate_main_power",authenticateToken,adminController.AdminSubcategoryListmainPower);
router.post("/add_freelancer_headline",upload.fields([{name: "image", maxCount: 1}]),authenticateToken,adminController.AddFreelancerHeadline);
router.post("/add_business_headline",upload.fields([{name: "image", maxCount: 1}]),authenticateToken,adminController.AddBusinessHeadline);
router.post("/add_company_headline",upload.fields([{name: "image", maxCount: 1}]),authenticateToken,adminController.AddCompanyHeadline);
router.post("/add_individual_headline",upload.fields([{name: "image", maxCount: 1}]),authenticateToken,adminController.AddIndividualHeadline);
router.post("/add_freelancer_benefit",authenticateToken,adminController.AddFreelancerBenefit);
router.post("/add_business_benefit",authenticateToken,adminController.AddBusinessBenefit);
router.post("/add_company_benefit",authenticateToken,adminController.AddCompanyBenefit);
router.post("/add_individual_benefit",authenticateToken,adminController.AddIndividualBenefit);
router.post("/add_freelancer_work",authenticateToken,adminController.AddFreelancerWork);

// Admin Role Management
router.post("/createRole", authenticateToken, adminController.createRole);
router.get("/getAllRoles", authenticateToken, adminController.getAllRoles);
router.get("/getRoleById", authenticateToken, adminController.getRoleById);
router.post("/updateRole", authenticateToken, adminController.updateRole);
router.post("/deleteRole", authenticateToken, adminController.deleteRole);

router.post("/createSubAdmin", authenticateToken, adminController.registerAdmin);
router.post("/loginAdmin", adminController.loginAdmin);
router.get("/getAllAdmins", authenticateToken, adminController.getAllAdmins);
router.get("/getAdminById", authenticateToken, adminController.getAdminById);
router.post("/updateAdmin", authenticateToken, adminController.updateAdmin);
router.post("/deleteAdmin", authenticateToken, adminController.deleteAdmin);



module.exports = router;
