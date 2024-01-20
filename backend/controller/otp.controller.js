const { OtpModel } = require('../models/otp.models');
const { generateOTP } = require('../util/generateOtp');
const { sendEmail } = require('../util/sendEmail');
const bcrypt = require('bcrypt');

const verifyOTP = async ( email, otp) => {
    try {
        if (!(email || otp)) {
            throw Error("Provide values for email, otp");
        }

        // ensure otp record exists
        const matchOTPRecord = await OtpModel.findOne( {email});

        if (!matchOTPRecord) {
            throw Error("No otp records found");
        }

        const { expiresAt } = matchOTPRecord;

        // checking for expired code
        if (expiresAt < Date.now()) {
            await OtpModel.deleteOne( email);
            throw Error("Code has expired. Request for a new one.");
        }

        // not expired
        const validOTP = await bcrypt.compare(otp, matchOTPRecord.otp);

        return validOTP;
    } catch (error) {
        throw error;
    }
};

const sendOtp = async ({ email, subject, message, duration = 1 }) => {
    try {
        if (!(email && subject && message)) {
            throw Error("Provide values for email, subject, message");
        }

        await OtpModel.deleteOne({ email });

        const generatedOTP = await generateOTP();

        // send email
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: "OTP form CoinSquare",
            html: `<p>${message}</p><p style="color:tomato; font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p>`,
        };

        await sendEmail(mailOptions);

        // save otp
        const hashOtp = await bcrypt.hash(generatedOTP, 1);
        const newOTP = new OtpModel({
            email,
            otp: hashOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000 * +duration,
        });

        const createOtpRecord = await newOTP.save();
        return createOtpRecord;
    } catch (error) {
        throw error;
    }
};

// delete otp
const deleteOTP = async (email) => {
    try {
        await OtpModel.deleteOne({ email });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    sendOtp,
    verifyOTP,
    deleteOTP,
};
