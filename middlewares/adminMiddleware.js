const jwt = require("jsonwebtoken");
const { adminauth, adminblacklist } = require("../models/adminModel");


require("dotenv").config();

const authMiddleware = async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) return res.status(401).json({ result: false, msg: "Access denied. No token provided." });

	try {
		// Check if token is blacklisted
		const blacklisted = await adminblacklist.findOne({ token });
		if (blacklisted) {
			return res.status(401).json({ result: false, msg: "Invalid or expired token" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await adminauth.findById(decoded._id);

		if (!user) {
			return res.status(401).json({ result: false, msg: "Invalid token" });
		}

		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ result: false, msg: "Invalid or expired token" });
	}
};

module.exports = authMiddleware;
