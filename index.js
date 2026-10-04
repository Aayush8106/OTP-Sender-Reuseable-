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

// new api

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || "")
    .split(",").map((s) => s.trim()).filter(Boolean);

app.use("/contact", (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

const oneLine = (v, max) =>
    String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

app.post("/contact", async (req, res) => {
    const name = oneLine(req.body?.name, 100);
    const company = oneLine(req.body?.company, 100);
    const email = oneLine(req.body?.email, 200);
    const message = String(req.body?.message ?? "").trim().slice(0, 3000);

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !message) {
        return res.status(400).json({
            success: false,
            error: "Please fill in your name, a valid email and a message."
        });
    }

    try {
        await transporter.sendMail({
            from: process.env.MAIL,
            to: process.env.CONTACT_TO || process.env.MAIL,
            replyTo: email,
            subject: `Portfolio contact: ${name}${company ? ` (${company})` : ""}`,
            text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "-"}\n\n${message}`
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("SMTP ERROR:", error);
        return res.status(500).json({
            success: false,
            error: "Could not send your message. Please try again later."
        });
    }
});

export default app;