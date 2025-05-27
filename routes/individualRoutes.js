const express = require("express");
const individualConteroller = require("../controllers/individualConteroller");
const upload = require("../middlewares/uploadMiddleware");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/individual_profile",authenticateToken,individualConteroller.BusinessgetProfile);
router.get("/individual_terms",individualConteroller.getfaqIndividual);
router.get("/individual_privacy",individualConteroller.getprivacyIndividual);
router.get("/individual_faq",individualConteroller.getfaqIndividual);
router.post("/individual_header_update",upload.fields([{ name: "profile_image", maxCount: 1 }
    ]),authenticateToken,individualConteroller.IndividualHeaderUpdate);
router.get("/get_individual_banner",authenticateToken,individualConteroller.GetIndividualBanner);
router.get("/get_individual_headline",individualConteroller.getIndividualHeadline);
router.get("/get_individual_benefit",individualConteroller.getIndividualBenefit);

module.exports = router;
