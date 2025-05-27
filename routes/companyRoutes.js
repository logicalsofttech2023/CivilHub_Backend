const express = require("express");
const companyController = require("../controllers/companyController");
const upload = require("../middlewares/uploadMiddleware");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/company_profile",authenticateToken,companyController.CompanygetProfile);
router.post("/add_fortfolio",upload.array("image",10),companyController.addPortfolio);
router.post("/get_fortfolios",authenticateToken,companyController.companyfortfoliosList);
router.post("/update_fortfolio",upload.fields([{ name: "image", maxCount: 1 }]),companyController.updatePortfolio);
router.post("/create_project_company",authenticateToken,upload.array("fileattach",10),companyController.createPostprojectComapny);

router.post("/update_company_project",authenticateToken,upload.array("fileattach",10),companyController.UpdateCompanyProject);

router.post("/create_post_company",authenticateToken,companyController.createPostjobComapny);
router.post("/update_company_post",authenticateToken,companyController.UpdateCompanyPost);
router.get("/all_category_job",authenticateToken,companyController.AlljobcategoryFatchuser);
router.post("/all_freelancer_list",authenticateToken,companyController.allfreelancerList);
router.post("/save_like_status",authenticateToken,companyController.saveLikeStatus);
router.post("/company_header_update",upload.fields([{ name: "profile_image", maxCount: 1 },{ name: "banner_image", maxCount: 1 }
    ]),authenticateToken,companyController.companyHeaderUpdate);
router.post("/company_information_update",authenticateToken,companyController.companyContactinformationrUpdate);
router.post("/company_description_update",authenticateToken,companyController.companyDescriptionUpdate);
router.get("/company_termscomdition",companyController.getTermsconditionCompany);
router.get("/company_privacy_policy",companyController.getprivacyCompany);
router.get("/company_faq",companyController.getfaqCompany);
router.post("/freelance_compnay_details",authenticateToken,companyController.CompanygetfreelnaceDetails);
router.post("/all_company_jobs",authenticateToken,companyController.CompanygetjobList);
router.post("/all_company_project",authenticateToken,companyController.CompanygetprojectList);
router.post("/company_jobs_details",authenticateToken,companyController.CompanygetjobListDetails);
router.post("/company_project_details",authenticateToken,companyController.CompanygetprojectListDetails);
router.post("/company_job_delete",authenticateToken,companyController.companyjobDelete);
router.post("/company_project_delete",authenticateToken,companyController.companyProjectDelete);
router.post("/company_portfolio_delete",authenticateToken,companyController.companyportfolioDelete);
router.post("/company_job_application",authenticateToken,companyController.Companyjobapplication);
router.post("/company_job_application_deatils",authenticateToken,companyController.CompanyjobapplicationDetails);
router.post("/job_application_accept_reject",authenticateToken,companyController.updateApplicationStatuschanges);
router.post("/project_proposal",authenticateToken,companyController.Companyprojectprposal);
router.post("/project_proposal_details",authenticateToken,companyController.CompanyprojectproposalDetails);
router.post("/prject_proposal_accept_reject",authenticateToken,companyController.updateprojetcproposalStatuschanges);
router.post("/category_freelancer_list",authenticateToken,companyController.CategoryfreelancerList);
router.post("/add_company_transaction",authenticateToken,companyController.addcompanyTransaction);
router.post("/get_company_transaction",authenticateToken,companyController.getcompanyTransaction);
router.get("/all_tendor_list",authenticateToken,companyController.getAllTendorList);
router.get("/get_company_banner",authenticateToken,companyController.GetCompanyBanner);
router.get("/get_company_headline",companyController.getCompanyHeadline);
router.get("/get_company_benefit",companyController.getCompanyBenefit);

module.exports = router;
