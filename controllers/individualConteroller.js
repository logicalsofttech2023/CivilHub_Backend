const axios = require("axios");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const {
	Cate_job,
	Terms,
	Privacy,
	FAQ,
	freelancerbanner,
	marketcate,
       IndividualBanner,
       IndividualHeadline,
       IndividualBenefit
} = require("../models/adminModel");

const { Auth, Blacklist } = require("../models/authsModel");

const {
	freeFourtFolio,
	Bid,
	Apply,
	Apply_Project,
	Job_Favorite,
	Project_Favorite,
	Transaction_Report,
} = require("../models/freelancerModel");

const { Project, Job } = require("../models/companyModel");

const {
	Business_Product,
	Business_Service,
} = require("../models/businessModel");

const { Product_Requirment, checkout } = require("../models/marketModel");

const BusinessgetProfile = async (req, res) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			return res.status(400).json({
				result: false,
				msg: "Parameter required: userId",
			});
		}

		const individual = await Auth.findById(userId).select(
			"first_name last_name email mobile profile_image username address"
		);

		if (!individual) {
			return res.status(404).json({
				result: false,
				msg: "Individual Detail not found",
			});
		}

		const profileFields = {
			first_name: individual.first_name,
			last_name: individual.last_name,
			email: individual.email,
			mobile: individual.mobile,
			profile_image: individual.profile_image,
			username: individual.username,
			address: individual.address
		};

		const totalFields = Object.keys(profileFields).length;

		const filledFields = Object.values(profileFields).filter(
			(value) => value !== undefined && value !== null && value !== ""
		).length;

		const profilePercentage = Math.round((filledFields / totalFields) * 100);

		return res.status(200).json({
			result: true,
			msg: "Individual Details fetched successfully",
			data: {
				profile_percentage: profilePercentage + "%",
				userId: individual._id || "",
				first_name: individual.first_name || "",
				last_name: individual.last_name || "",
				email: individual.email || "",
				mobile: individual.mobile || "",
				profile_image: individual.profile_image || "",
				username: individual.username || "",
				address: individual.address || ""
			},
		});
	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message,
		});
	}
};

const getTermsconditionIndividual = async (req, res) => {
	try {
		const fetchTerms = await Terms.find({ type: "Individual" });

		if (!fetchTerms || fetchTerms.length === 0) {
			return res.status(400).json({
				result: "false",
				msg: "No data found for type Individual!"
			});
		}

		res.status(200).json({
			result: "true",
			msg: "Terms and Conditions list for type Individual",
			data: fetchTerms
		});

	} catch (error) {
		return res.status(500).json({
			result: "false",
			msg: "Server error",
			error: error.message
		});
	}
};


const getprivacyIndividual = async (req, res) => {
	try {
		const fetchprivacy = await Privacy.find({ type: "Individual" });

		if (!fetchprivacy || fetchprivacy.length === 0) {
			return res.status(400).json({
				result: "false",
				msg: "No data found for type Individual!"
			});
		}

		res.status(200).json({
			result: "true",
			msg: "Privacy Policy list for type Individual",
			data: fetchprivacy
		});

	} catch (error) {
		return res.status(500).json({
			result: "false",
			msg: "Server error",
			error: error.message
		});
	}
};

const getfaqIndividual = async (req, res) => {
	try {
		const fetchfaq = await FAQ.find({ type: "Individual" });

		if (!fetchfaq || fetchfaq.length === 0) {
			return res.status(400).json({
				result: "false",
				msg: "No data found for type Individual!"
			});
		}

		res.status(200).json({
			result: "true",
			msg: "FAQ list for type Individual",
			data: fetchfaq
		});

	} catch (error) {
		return res.status(500).json({
			result: "false",
			msg: "Server error",
			error: error.message
		});
	}
};

const IndividualHeaderUpdate = async (req, res) => {
		try {
				const { userID, first_name, last_name, email, address, mobile } = req.body;

				const profile_image = req.files?.profile_image ? req.files.profile_image[0].filename : null;

				if (!userID) {
						return res.status(400).json({
								result: false,
								msg: "Parameter required: userID (optional: first_name, last_name, email, profile_image, address, mobile)",
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

				if (first_name) user.first_name = first_name;
				if (last_name) user.last_name = last_name;
				if (address) user.address = address;
				if (email) user.email = email;
				if (mobile) user.mobile = mobile;
				if (profile_image) user.profile_image = profile_image;

				await user.save();

				const responseUser = user.toObject();
				res.status(200).json({
						result: true,
						msg: "Individual Header Updated Successfully",
						data: responseUser,
				});

		} catch (error) {
				res.status(500).json({
						result: false,
						msg: "Error updating individual header",
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

const getIndividualHeadline = async (req, res) => {
	try {
		const fatchheadline = await IndividualHeadline.find().sort({ _id: -1 });

		if (!fatchheadline || fatchheadline.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No Individual headline found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Individual Headline List",
			data: fatchheadline,
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Server Error!",
			error: error.message,
		});
	}
};

const getIndividualBenefit = async (req, res) => {
	try {
		const fatchBenefit = await IndividualBenefit.find().sort({ _id: -1 });

		if (!fatchBenefit || fatchBenefit.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No freelancer Benefit found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Freelancer Benefit List",
			data: fatchBenefit,
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
	BusinessgetProfile,
	getTermsconditionIndividual,
	getprivacyIndividual,
	getfaqIndividual,
	IndividualHeaderUpdate,
        GetIndividualBanner,
        getIndividualHeadline,
        getIndividualBenefit
};
