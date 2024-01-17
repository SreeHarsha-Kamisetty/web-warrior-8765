const express = require('express');
const { UserModel } = require('../models/user.models');
const { sendOtp,verifyOTP,deleteOTP } = require('../controller/otp.controller');
const {sendPasswordResetOTPEmail}=require('../controller/forgotPassword.controller')
const forgotPassRouter = express.Router();
const bcrypt=require('bcrypt');

// Password reset request
forgotPassRouter.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            throw Error("An email is required");
        }

           const createdPasswrodResetOTP=await sendPasswordResetOTPEmail(email);

           res.status(200).json({msg:createdPasswrodResetOTP});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


forgotPassRouter.post('/reset',async(req,res)=>{
    try{
           let {email,otp,newPassword}=req.body;
           if(!(email && otp && newPassword)){
             throw Error("Empty credentials are not allowed")
            }
            console.log("hIii");
            console.log(newPassword)
           await resetUserPassword(email,otp,newPassword);
           res.status(200).json({email,passwordreset:true});
    }
    catch(error){
          res.status(400).send(error.msg)
    }
})


const resetUserPassword=async(email,otp,newPassword)=>{
    try{
        console.log("anajli");
        console.log(newPassword);
         const validOTP=await verifyOTP(email,otp);
         console.log(validOTP);
         if(!validOTP){
            throw Error("Invalid code passed. Check your inbox")
         }
         //update
         console.log(newPassword);
        //  if(newPassword.length<6){
        //     throw Error("Password is too short!")
        //  }

         const hashNewPassword = await bcrypt.hash(newPassword, 1); 
         console.log(hashNewPassword);
        await UserModel.updateOne({ email }, { password: hashNewPassword });
        await deleteOTP(email);
        return;
    }
    catch(error){
        console.log(error);
       throw error;
    }
}



module.exports = {
    forgotPassRouter
}
