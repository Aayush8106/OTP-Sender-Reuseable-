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



app.post("/contact", async (req, res) => {

    if (req.headers["x-api-key"] !== process.env.MAIL_SERVICE_KEY) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    const{name , company , email , message} = req.body;

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
            to: email,
            subject: `Portfolio contact: ${name}${company ? ` (${company})` : ""}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333;">Hi ${name},</h2>
            <p style="font-size: 16px; color: #555; line-height: 1.5;">
                Thank you for reaching out! I have successfully received your message sent via my portfolio contact form.
            </p>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0070f3; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #333;">Message Copy:</h4>
                <p style="font-style: italic; color: #666; margin-bottom: 0;">"${message}"</p>
            </div>
            <p style="font-size: 16px; color: #555; line-height: 1.5;">
                I will review your details and get back to you as soon as possible. 
            </p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="font-size: 14px; color: #999; margin-bottom: 0;">
                Best regards,<br />
                <strong>Aayush Patel</strong><br />
                <a href="https://currentliveprojects.in" style="color: #0070f3; text-decoration: none;">currentliveprojects.in</a>
            </p>
        </div>
    `
        });

         await transporter.sendMail({
            from: process.env.MAIL,
            to: process.env.CONTACT_TO || process.env.MAIL, // Fallback if CONTACT_TO isn't set
            subject: `💼 New Portfolio Message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #0070f3; margin-top: 0;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                    <div style="margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
                        <strong>Message:</strong>
                        <p style="white-space: pre-wrap; margin-top: 5px;">${message}</p>
                    </div>
                </div>
            `
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