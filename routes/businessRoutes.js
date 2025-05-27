const express = require("express");
const businessController = require("../controllers/businessController");
const upload = require("../middlewares/uploadMiddleware");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/business_profile",authenticateToken,businessController.BusinessgetProfile);
router.post("/add_business_transaction",authenticateToken,businessController.addbusinessTransaction);
router.post("/get_business_transaction",authenticateToken,businessController.getbusinessTransaction);
router.get("/business_terms",businessController.getTermsconditionBusiness);
router.get("/business_privacy",businessController.getprivacyBusiness);
router.get("/business_faq",businessController.getfaqBusiness);
router.post("/business_header_update",upload.fields([{ name: "profile_image", maxCount: 1 }
    ]),authenticateToken,businessController.businessHeaderUpdate);
router.post("/business_description_update",authenticateToken,businessController.businessDescriptionUpdate);
router.post("/business_information_update",authenticateToken,businessController.businessContactinformationrUpdate);
router.get("/all_product_category",authenticateToken,businessController.AllproductcategoryFatch);
router.post("/add_business_product",upload.array("product_image",10),authenticateToken,businessController.addBusinessProduct);
router.post("/get_business_product",authenticateToken,businessController.getBusinessProduct);
router.post("/business_product_delete",authenticateToken,businessController.BusinessProductDelete);
router.post("/update_business_product",upload.array("product_image",10),authenticateToken,businessController.updateBusinessProduct);
router.post("/business_product_details",authenticateToken,businessController.BusinessProductDetails);
router.get("/all_service_category",authenticateToken,businessController.AllservicecategoryFatch);
router.post("/add_business_service",upload.array("service_image",10),authenticateToken,businessController.addBusinessService);
router.post("/get_business_service",authenticateToken,businessController.getBusinessService);
router.post("/business_service_delete",authenticateToken,businessController.BusinessServiceDelete);
router.post("/update_business_service",upload.array("service_image",10),authenticateToken,businessController.updateBusinessService);
router.post("/business_service_details",authenticateToken,businessController.BusinessServiceDetails);
router.get("/get_product_requirment",authenticateToken,businessController.GetProductRequirment);

router.get("/all_product_requirment",authenticateToken,businessController.GetProductRequirmentAll);
router.post("/order_accept_reject",authenticateToken,businessController.marketOrderAcceptreject);
router.post("/order_product_pending",authenticateToken,businessController.GetCheckoutOrderPending);
router.post("/order_product_accept",authenticateToken,businessController.GetCheckoutOrderaccept);
router.post("/order_product_reject",authenticateToken,businessController.GetCheckoutOrderreject);
router.post("/add_quotation",upload.array("file",10),businessController.addbussinessQuotation); 
router.get("/get_business_banner",authenticateToken,businessController.GetBusinessBanner);
router.get("/get_business_headline",businessController.getBusinessHeadline);
router.get("/get_business_benefit",businessController.getBusinessBenefit);

module.exports = router;
