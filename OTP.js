import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app=express();
const PORT=process.env.PORT || 3000;

app.use(express.json());

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
});

//api to send mail for register route
  app.post("/register-otp",async(req,res)=>{
    if(req.headers["x-api-key"]!==process.env.MAIL_SERVICE_KEY){
        return res.status(401).json({error:"Unauthorized"})
    }
    //taking otp and mail as input
      const {mail,otp}=req.body;
      // sending mail to user
            await transporter.sendMail({
              from:process.env.MAIL,
              to:mail,
                subject:"OTP Verification.",
        html:`<h2 ">
            Your OTP is:<b>${otp}</b>
        </h2>`
    });

    //sending true to user's browser
       return res.status(200).json({
        success:true
       })

  });

app.listen(PORT,()=>{
    console.log(`App is on:${PORT}.`);
})