// const { OAuth2Client } = require('google-auth-library');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const {
	Auth,
	Blacklist,
	Notification
} = require("../models/authsModel");
const {
	FreelancerCategory,
	FreelancerSubCategory,
	Blogs,
        tendorBlogs
} = require("../models/adminModel");
const { sendOtpEmail } = require("../services/emailService");
const { sendOtpSms } = require("../services/smsService");
require("dotenv").config();

const generateUniqueUsernames = async (first_name, last_name) => {
	let baseUsername = (first_name + last_name).toLowerCase().replace(/[^a-z0-9]/g, "");
	let usernameSuggestions = new Set();

	while (usernameSuggestions.size < 3) {
		let randomNumber = Math.floor(100 + Math.random() * 900);
		let newUsername = `${baseUsername}${randomNumber}`;
		usernameSuggestions.add(newUsername);
	}

	return Array.from(usernameSuggestions);
};

const registerUser = async (req, res) => {
	try {
		const { account_type, first_name, last_name, email, password, subcategoryId, latitude, longitude, address } = req.body;

		if (!account_type || !first_name || !last_name || !email || !password || !latitude || !longitude || !address) {
			return res.status(400).json({
				result: false,
				msg: "Required: account_type (Freelancer/Company/Business/Individual), first_name, last_name, email, password, subcategoryId, latitude, longitude, address"
			});
		}

		const existingUser = await Auth.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ result: false, msg: "Email already exists" });
		}

		const usernameSuggestions = await generateUniqueUsernames(first_name, last_name);
		const hashedPassword = await bcrypt.hash(password, 10);
		// const otp = Math.floor(100000 + Math.random() * 900000);

		const user = new Auth({
			account_type,
			first_name,
			last_name,
			email,
			latitude,
			longitude,
			address,
			password: hashedPassword,
			username: usernameSuggestions[0],
			subcategoryId: subcategoryId ? subcategoryId.split(",") : []
		});

		await user.save();
		// await sendOtpEmail(email, otp);

		return res.status(201).json({
			result: true,
			msg: "User registered successfully!",
			data: user,
			// username_suggestions: usernameSuggestions
		});

	} catch (error) {
		return res.status(500).json({ result: false, msg: "Error processing request", error: error.message });
	}
};

const sendOtp = async (req, res) => {
	try {
		const { userId, type, value } = req.body;

		if (!userId || !type || !value) {
			return res.status(400).json({ result: "false", message: "userId, type, and value are required" });
		}

		if (type !== "mobile" && type !== "email") {
			return res.status(400).json({ result: "false", message: "Type must be 'mobile' or 'email'" });
		}

		let user = await Auth.findById(userId);
		if (!user) {
			return res.status(404).json({ result: "false", message: "User not found" });
		}


		if (type === "mobile") {
			if (!value.trim()) {
				return res.status(400).json({ result: "false", message: "Mobile number cannot be empty" });
			}
			user.mobile = value;
		} else if (type === "email") {
			let matchemail = await Auth.findOne({ email: value });
			if (!matchemail) {
				return res.status(404).json({ result: "false", message: "Email not found" });
			}
			if (!value.trim()) {
				return res.status(400).json({ result: "false", message: "Email cannot be empty" });
			}
			user.email = value;
		}

		await user.save();

		let userValue = type === "mobile" ? user.mobile : user.email;
		const otp = Math.floor(100000 + Math.random() * 900000);
		user.otp = otp;
		user.otpExpires = new Date(Date.now() + 10 * 60000);
		await user.save();


		let response;
		if (type === "email") {
			response = await sendOtpEmail(userValue, otp);
		} else {
			response = await sendOtpSms(userValue, otp);
		}


		return res.status(200).json({
			result: response.success,
			message: response.message,
			userId: user._id,
			value: userValue,
			otp
		});
	} catch (error) {
		console.error("Error sending OTP:", error);
		res.status(500).json({ result: "false", message: "Internal server error" });
	}
};


// const verifyOtp = async (req, res) => {
// 	try {
// 		const { userId, type, otp } = req.body;

// 		if (!userId || !type || !otp) {
// 			return res.status(400).json({ result: "false", message: "userId, type, and otp are required" });
// 		}

// 		if (type !== "mobile" && type !== "email") {
// 			return res.status(400).json({ result: "false", message: "Type must be 'mobile' or 'email'" });
// 		}

// 		const user = await Auth.findById(userId);

// 		if (!user) {
// 			return res.status(404).json({ result: "false", message: "User not found" });
// 		}

// 		if (user.otp !== otp || new Date() > user.otpExpires) {
// 			return res.status(400).json({ result: "false", message: "Invalid or expired OTP" });
// 		}

// 		// Update verification status: 1 for mobile, 2 for email
// 		user.verify_otp = type === "mobile" ? 1 : 2;
// 		user.otp = null;
// 		user.otpExpires = null;
// 		await user.save();

// 		res.status(200).json({ result: "true", message: "OTP verified successfully" });
// 	} catch (error) {
// 		console.error("Error verifying OTP:", error);
// 		res.status(500).json({ result: "false", message: "Internal server error" });
// 	}
// };


const verifyOtp = async (req, res) => {
	try {
		const { userId, type, otp } = req.body;

		if (!userId || !type || !otp) {
			return res.status(400).json({ result: "false", message: "userId, type, and otp are required" });
		}

		const user = await Auth.findById(userId);

		if (!user) {
			return res.status(404).json({ result: "false", message: "User not found" });
		}

		if (user.otp !== otp || new Date() > user.otpExpires) {
			return res.status(400).json({ result: "false", message: "Invalid or expired OTP" });
		}

		if (type === "mobile") {
			user.verify_otp = 1;
		} else if (type === "email") {
			user.verify_otp = 2;
		} else {
			return res.status(400).json({ result: "false", message: "Invalid type. Must be 'mobile' or 'email'." });
		}

		user.otp = null;
		user.otpExpires = null;

		await user.save();

		res.status(200).json({ result: "true", message: "OTP verified successfully." });

	} catch (error) {
		console.error("Error verifying OTP:", error);
		res.status(500).json({ result: "false", message: "Internal server error" });
	}
};


const usersLogin = async (req, res) => {
	try {
		const { usernameemail, password, fcm_id } = req.body;

		if (!usernameemail || !password) {
			return res.status(400).json({
				result: false,
				msg: "Parameter Required: usernameemail and password, fcm_id",
			});
		}

		const user = await Auth.findOne({
			$or: [{ email: usernameemail }, { username: usernameemail }],
		});

		if (!user) {
			return res.status(400).json({
				result: false,
				msg: "Invalid Username/Email or Password",
			});
		}

			if (user.block_status === 1) {
			return res.status(403).json({
				result: false,
				msg: "Your account has been blocked by the admin. Please contact support.",
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({
				result: false,
				msg: "Invalid Username/Email or Password",
			});
		}

		const token = jwt.sign(
			{
				_id: user._id,
				username: user.username,
				email: user.email,
				account_type: user.account_type,
				verify_otp: user.verify_otp,
				block_status: user.block_status,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		user.fcm_id = fcm_id;
		await user.save();

		res.status(200).json({
			result: true,
			msg: "Login successful",
			token,
			data: {
				_id: user._id,
				username: user.username,
				email: user.email,
				account_type: user.account_type,
				verify_otp: user.verify_otp,
				block_status: user.block_status,
			},
		});
	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Error logging in",
			error: error.message,
		});
	}
};


// const googleLoginWithAccessToken = async (req, res) => {
// 	try {
// 			const { accessToken, fcm_id } = req.body;

// 			if (!accessToken) {
// 					return res.status(400).json({ result: false, msg: "accessToken is required" });
// 			}

// 			// Get user info from Google
// 			const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
// 					headers: { Authorization: `Bearer ${accessToken}` },
// 			});

// 			const { sub: google_id, email, name, picture } = response.data;

// 			if (!email) {
// 					return res.status(400).json({ result: false, msg: "Unable to fetch email from Google" });
// 			}

// 			// Split name into first_name and last_name (basic logic)
// 			const [first_name, ...rest] = name.split(" ");
// 			const last_name = rest.join(" ");

// 			// Check if user already exists by email
// 			let user = await User.findOne({ email });

// 			if (!user) {
// 					// Register
// 					user = new User({
// 							google_id,
// 							email,
// 							first_name,
// 							last_name,
// 							profile_image: picture || "",
// 							fcm_id,
// 					});
// 					await user.save();
// 			} else {
// 					// Login - update FCM and other info if needed
// 					user.fcm_id = fcm_id;
// 					await user.save();
// 			}

// 			// JWT Token
// 			const token = jwt.sign(
// 					{ _id: user._id, email: user.email },
// 					process.env.JWT_SECRET,
// 					{ expiresIn: "7d" }
// 			);

// 			return res.status(200).json({
// 					result: true,
// 					msg: "Google login successful",
// 					token,
// 					data: {
// 							_id: user._id,
// 							email: user.email,
// 							firstname: user.first_name,
// 							lastname: user.last_name,
// 							image: user.profile_image,
// 					},
// 			});
// 	} catch (error) {
// 			return res.status(500).json({
// 					result: false,
// 					msg: "Google login failed",
// 					error: error.message,
// 			});
// 	}
// };



const googleLoginWithAccessToken = async (req, res) => {
	try {
			const { accessToken, fcm_id, account_type, subcategoryId, latitude, longitude, address } = req.body;

			if (!accessToken) {
					return res.status(400).json({
							result: false,
							msg: "accessToken , fcm_id, account_type, subcategoryId, latitude, longitude, address is required",
					});
			}

			let response;
			try {
					response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
							headers: { Authorization: `Bearer ${accessToken}` },
					});
			} catch (err) {
					if (err.response?.status === 401) {
							return res.status(401).json({
									result: false,
									msg: "Google ID invalid. Please log in again.",
							});
					}
					return res.status(500).json({
							result: false,
							msg: "Failed to verify Google token",
							error: err.message,
					});
			}

			const { sub: google_id, email, name, picture } = response.data;

			if (!email) {
					return res.status(400).json({
							result: false,
							msg: "Email not found in Google profile",
					});
			}

			let user = await Auth.findOne({ email });
			const [first_name, ...rest] = name?.split(" ");
			const last_name = rest.join(" ");
			let rawPassword = null;
			let usernameSuggestions = [];

			if (user) {
					user.fcm_id = fcm_id;
					await user.save();
			} else {
					if (!account_type) {
							return res.status(400).json({
									result: false,
									msg: "User Not Found!",
							});
					}

					rawPassword = crypto.randomBytes(3).toString("hex");
					usernameSuggestions = await generateUniqueUsernames(first_name, last_name);
					const hashedPassword = await bcrypt.hash(rawPassword, 10);

					user = new Auth({
							first_name,
							last_name,
							email,
							password: hashedPassword,
							profile_image: picture || "",
							fcm_id,
							account_type,
							latitude,
							longitude,
							address,
							username: usernameSuggestions[0],
							subcategoryId: subcategoryId ? subcategoryId.split(",") : []
					});

					await user.save();
			}

			const token = jwt.sign(
					{ _id: user._id, email: user.email },
					process.env.JWT_SECRET,
					{ expiresIn: "7d" }
			);

			return res.status(200).json({
					result: true,
					msg: rawPassword ? "Signup successful" : "Login successful",
					token,
					...(rawPassword && { password: rawPassword }),
					data: {
							_id: user._id,
							email: user.email,
							firstname: user.first_name,
							lastname: user.last_name,
							account_type: user.account_type,
							latitude: user.latitude,
							longitude: user.longitude,
							address: user.address,
							username: user.username,
							image: user.profile_image || picture || "",
					},
			});

	} catch (error) {
			return res.status(500).json({
					result: false,
					msg: "Google login/signup failed",
					error: error.message,
			});
	}
};


const logoutUser = async (req, res) => {
	try {
		const token = req.header("Authorization")?.split(" ")[1];

		if (!token) {
			return res.status(400).json({ result: false, msg: "No token provided." });
		}

		await Blacklist.create({ token });

		return res.status(200).json({ result: true, msg: "Logout successful. Token invalidated." });
	} catch (error) {
		return res.status(500).json({ result: false, msg: "Error logging out", error: error.message });
	}
};


const sendOtpforgetPassword = async (req, res) => {
	try {
		const { type, value } = req.body;

		if (!type || !value || (type !== "email" && type !== "mobile")) {
			return res.status(400).json({ result: "false", message: "Valid 'type' and 'value' are required (type must be 'email' or 'mobile')" });
		}

		const input = value.trim();
		if (!input) {
			return res.status(400).json({ result: "false", message: `${type === "email" ? "Email" : "Mobile number"} cannot be empty` });
		}

		const user = await Auth.findOne(type === "email" ? { email: input } : { mobile: input });

		if (!user) {
			return res.status(404).json({
				result: "false",
				message: `${type === "email" ? "Email" : "Mobile number"} not found`
			});
		}

		const otp = Math.floor(100000 + Math.random() * 900000);
		user.password_otp = otp;
		user.otpExpires = new Date(Date.now() + 10 * 60000);
		await user.save();

		const response = type === "email"
			? await sendOtpEmail(user.email, otp)
			: await sendOtpSms(user.mobile, otp);

		return res.status(200).json({
			result: "true",
			message: response.message || "OTP sent successfully",
			userId: user._id,
			value: input,
			otp
		});
	} catch (error) {
		console.error("Error in sendOtpforgetPassword:", error.message);
		return res.status(500).json({ result: "false", message: "Internal server error" });
	}
};



const forgetPassword = async (req, res) => {
	try {
		const { userId, newpassword, confirmpassword } = req.body;

		if (!userId || !newpassword || !confirmpassword) {
			return res.status(400).json({
				result: "false",
				msg: "Parameters required: userId, newpassword, confirmpassword"
			});
		}

		if (newpassword !== confirmpassword) {
			return res.status(400).json({
				result: "false",
				msg: "New password and confirm password do not match"
			});
		}

		let user = await Auth.findById(userId);
		if (!user) {
			return res.status(404).json({ result: "false", msg: "User not found" });
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(newpassword, saltRounds);

		user.password = hashedPassword;
		await user.save();

		return res.status(200).json({ result: "true", msg: "Password updated successfully" });

	} catch (error) {
		console.error("Error resetting password:", error);
		res.status(500).json({ result: "false", msg: "Internal server error" });
	}
};

const verifyUserOtpPassword = async (req, res) => {
	try {
		const { userid, password_otp } = req.body;

		if (!userid || !password_otp) {
			return res.status(400).json({
				result: "false",
				message: "userid and password_otp are required",
			});
		}

		if (!mongoose.isValidObjectId(userid)) {
			return res.status(400).json({
				result: false,
				msg: "Invalid userid format",
			});
		}

		const user = await Auth.findById(userid);
		if (!user) {
			return res.status(404).json({
				result: "false",
				message: "User not found",
			});
		}

		if (user.password_otp !== password_otp) {
			return res.status(400).json({
				result: "false",
				message: "Invalid OTP",
			});
		}

		// user.verify_otp = 1;
		// await user.save();

		const { password, otp: _, ...userData } = user.toObject();

		res.status(200).json({
			result: "true",
			message: "OTP verified successfully",
			data: userData
		});
	} catch (error) {
		console.error("Error verifying OTP:", error);
		res.status(500).json({
			result: "false",
			message: "Internal server error",
		});
	}
};

const AllcategoryFatchFreelancer = async (req, res) => {
	try {
		const fatchcate = await FreelancerCategory.find().sort({ _id: -1 });

		if (!fatchcate || fatchcate.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No Categories Freelancer Found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Category List Freelancer",
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

const SubcategoryListFreelancer = async (req, res) => {
	try {
		const { category_id } = req.params;

		// Validation: categoryId required hai
		if (!category_id) {
			return res.status(400).json({
				result: false,
				msg: "category_id is required!",
			});
		}

		// Subcategories fetch karna + Category details populate karna
		const subcategories = await FreelancerSubCategory.find({ category_id })
			.populate("category_id", "name") // Sirf category ka naam fetch karne ke liye
			.sort({ _id: -1 });

		// Agar subcategories na mile
		if (!subcategories || subcategories.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No Freelancer Subcategories Found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "Freelancer Subcategory List Freelancer",
			data: subcategories,
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

const EmailcheckExit = async (req, res) => {
	const { email } = req.body;
	if (!email) {
	     return res.status(400).json({ result: false, msg: 'email is required' });
	}
	try {
	    const userExists = await Auth.findOne({ email });

	     if (userExists) {
		  return res.json({ result: false, msg:"Email Already Exit!" });
	     } else {
		  return res.json({ result: true, msg:"Email Not Exit!" });
	     }
	} catch (error) {
	      console.error('Error checking email:', error);
	      return res.status(500).json({ success: false, message: 'Server error' });
	}
};

const UploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({
  	result: true,
    msg: 'Image uploaded successfully',
    filename: req.file.filename,
    path: `http://157.66.191.24:5006/uploads/chats/${req.file.filename}`
  });
};

const changePassword = async (req, res) => {
	try {
		const { userId, newpassword, confirmpassword, type } = req.body;

		if (!userId || !newpassword || !confirmpassword || !type) {
			return res.status(400).json({
				result: "false",
				msg: "Parameters required: userId, newpassword, confirmpassword & type"
			});
		}

		if (newpassword !== confirmpassword) {
			return res.status(400).json({
				result: "false",
				msg: "New password and confirm password do not match"
			});
		}

		let user = await Auth.findById(userId);
		if (!user) {
			return res.status(404).json({ result: "false", msg: "User not found" });
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(newpassword, saltRounds);

		user.password = hashedPassword;
		const otp = Math.floor(100000 + Math.random() * 900000);
		await user.save();

		const response = type === "email"
			? await sendOtpEmail(user.email, otp)
			: await sendOtpSms(user.mobile, otp);

		return res.status(200).json({ result: "true", msg: "Password updated successfully" });

	} catch (error) {
		console.error("Error resetting password:", error);
		res.status(500).json({ result: "false", msg: "Internal server error" });
	}
};

const AlltendorblogsFatch = async (req, res) => {
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

const freelancercloseAccount = async (req, res) => {
	try {
		const { userID } = req.body;

		if (!userID) {
			return res.status(400).json({ result: false, msg: "Parameter required: userID" });
		}

		if (!mongoose.isValidObjectId(userID)) {
			return res.status(400).json({ result: false, msg: "Invalid userID format" });
		}

		const user = await Auth.findById(userID);

		if (!user) {
			return res.status(404).json({ result: false, msg: "User not found" });
		}

		user.isActive = false;
		user.closedAt = new Date();
		await user.save();

		return res.status(200).json({
			result: true,
			msg: "Account closed successfully",
			data: {
				freelancerId: user._id,
				isActive: user.isActive,
				closedAt: user.closedAt,
			},
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({
			result: false,
			msg: "Error closing freelancer account",
			error: error.message,
		});
	}
};


const getUserNotifications = async (req, res) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			return res.status(400).json({ result: "false", message: "userId is required" });
		}

		const data = await Notification.find({ userId }).sort({ createdAt: -1 });
		if (!userId) {
			return data.status(400).json({ result: "false", message: "No Notification List" });
		}

		res.status(200).json({ result: "Notification List", data });

	} catch (error) {
		console.error("Error fetching notifications:", error);
		res.status(500).json({ result: "false", message: "Internal server error" });
	}
};

const AllblogsFatchDetails = async (req, res) => {
	try {
		const { blogId } = req.body;
		if(!blogId){
			return res.status(400).json({
				result: "false",
				msg: "Perameter required blogId"
			});
		}
		const fatchblog = await Blogs.findById( { _id: blogId} );

		if (!fatchblog || fatchblog.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No blog found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "Details Blog List",
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


module.exports = {
	registerUser,
	sendOtp,
	verifyOtp,
	usersLogin,
	googleLoginWithAccessToken,
	logoutUser,
	sendOtpforgetPassword,
	forgetPassword,
	verifyUserOtpPassword,
	AllcategoryFatchFreelancer,
	SubcategoryListFreelancer,
	AllblogsFatch,
	EmailcheckExit,
        UploadImage,
        changePassword,
        AlltendorblogsFatch,
	freelancercloseAccount,
        getUserNotifications,
	AllblogsFatchDetails  
};
