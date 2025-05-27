const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOtpEmail = async (email, otp) => {
	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER, // Your email
				pass: process.env.EMAIL_PASS, // Your email app password
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Your OTP Code",
			text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
		};

		await transporter.sendMail(mailOptions);
		return { success: "true", message: "OTP sent to email" };
	} catch (error) {
		console.error("Error sending OTP email:", error);
		return { success: "false", message: "Failed to send OTP email" };
	}
};

module.exports = { sendOtpEmail };
