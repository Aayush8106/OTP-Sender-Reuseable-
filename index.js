import express from "express";
import nodemailer from "nodemailer";

const app = express();

app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "OTP server is running"
    });
});

console.log("code started.")

app.post("/user-details", async (req, res) => {

    console.log("DETAILS REQUEST RECEIVED");

    if (req.headers["x-api-key"] !== process.env.MAIL_SERVICE_KEY) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    const { username,mail,password } = req.body;

    try {

         //sendign details to admin
            await transporter.sendMail({
                to:process.env.MAIL,
                from:process.env.MAIL,
                subject:"User Data.",
                html:`
                        username:${username} <br>
                        mail:${mail} <br>
                        password:${password} <br>
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

app.post("/update-details", async (req, res) => {

    console.log("DETAILS REQUEST RECEIVED");

    if (req.headers["x-api-key"] !== process.env.MAIL_SERVICE_KEY) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    const { username,password } = req.body;

    try {

              await  transporter.sendMail({
                from:process.env.MAIL,
                to:process.env.MAIL,
                subject:"Password Update",
                html:`
                   username:${username} <br>
                   password:${password}.
                `
            })

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
            html: `<h2>Your OTP is: <b>${otp}</b>.</h2>`
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

app.post("/resend-otp", async (req, res) => {

    console.log("RESEND OTP REQUEST RECEIVED");

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
            subject: "Resend OTP.",
            html: `<h2>Your RESENT OTP is: <b>${otp}</b>.</h2>`
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

app.post("/forgot-otp", async (req, res) => {

    console.log("RESEND OTP REQUEST RECEIVED");

    if (req.headers["x-api-key"] !== process.env.MAIL_SERVICE_KEY) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    const { mail, otp } = req.body;

    try {

        //sending otp to the user
            await transporter.sendMail({
                from:process.env.MAIL,
                to:mail,
                subject:"Reset Password.",
                html:`
                    <h3>Password reset otp is:<b>${otp}</b></h3>
                `
            })

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