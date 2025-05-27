const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);

const sendOtpSms = async (phoneNumber, otp) => {
	try {
		await client.messages.create({
			body: `Your OTP code is: ${otp}`,
			from: twilioNumber,
			to: phoneNumber,
		});
		return { success: "true", message: "OTP sent to mobile" };
	} catch (error) {
		console.error("Error sending OTP SMS:", error);
		return { success: "false", message: "Failed to send OTP SMS" };
	}
};

module.exports = { sendOtpSms };
