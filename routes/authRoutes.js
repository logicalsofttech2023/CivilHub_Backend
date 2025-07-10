const express = require("express");
const authController = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

// **Route for User Registration**
router.post("/authusers_registration", authController.registerUser);
router.post("/send_otp",authController.sendOtp);
router.post("/verify_otp",authController.verifyOtp);
router.post("/users_login",authController.usersLogin);
router.post("/google-login",authController.googleLoginWithAccessToken);
router.post("/user_logout",authenticateToken,authController.logoutUser);
router.post("/otpsend_forgotpassword",authController.sendOtpforgetPassword);
router.post("/forget_password",authController.forgetPassword);
router.post("/verify_otppassword",authController.verifyUserOtpPassword);
router.get("/all_freelancer_category",authController.AllcategoryFatchFreelancer);
router.get("/subcategory_freelancer/:category_id",authController.SubcategoryListFreelancer);
router.get("/all_blogs_list",authController.AllblogsFatch);
router.post("/email_exit",authController.EmailcheckExit);
router.post('/upload_image', upload.single('image'), authController.UploadImage);
router.post("/change_password",authController.changePassword);
router.get("/all_tendorblogs_list",authController.AlltendorblogsFatch);
router.post("/user_account_closed",authenticateToken,authController.freelancercloseAccount);
router.post("/user_notification",authenticateToken,authController.getUserNotifications);
router.post("/blogs_details",authController.AllblogsFatchDetails);

router.get("/getAllTopFreelancers",authController.getAllTopFreelancers);


module.exports = router;
