import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

const app = express();

app.use(express.json());
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
});

app.post("/register-otp", async (req, res) => {

    console.log("REGISTER OTP REQUEST RECEIVED");

    if (req.headers["x-api-key"] !== process.env.MAIL_SERVICE_KEY) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    const { mail, otp } = req.body;

    try {

        await transporter.sendMail({
            from: process.env.MAIL,
            to: mail,
            subject: "OTP Verification",
            html: `
                <h2>Your OTP is: <b>${otp}</b></h2>
            `
        });

        return res.status(200).json({
            success: true
        });

    } catch (error) {

        console.error("SMTP ERROR:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to send email"
        });
    }
});

export default app;