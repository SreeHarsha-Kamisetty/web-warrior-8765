const {UserModel}=require('../models/user.models');
const {sendOtp,verifyOTP,deleteOTP}=require('./otp.controller')

const sendPasswordResetOTPEmail=async(email)=>{
    try{
        const existingUser = await UserModel.findOne({ email });
        if(!existingUser){
            throw Error("There's no account for the provided email")
        }
        const otpDetails = {
            email,
            subject: "Password Reset",
            message: "Your password reset OTP is: ",
            duration: 1
        };

        const createdOTP = await sendOtp(otpDetails);

        return createdOTP;
    }

    catch(error){
      throw error;
    }
}
// const resetUserPassword=async(email,otp,newPassword)=>{
//     try{
//          const validOTP=await verifyOTP({email,otp});
//          console.log(validOTP);
//          if(!validOTP){
//             throw Error("Invalid code passed. Check your inbox")
//          }
//          //update
//          if(newPassword.length<6){
//             throw Error("Password is too short!")
//          }

//          const hashNewPassword = await bcrypt.hash(newPassword, 1); // Use a higher cost factor
//          console.log(hashNewPassword);
//         await UserModel.updateOne({ email }, { password: hashNewPassword });
//         await deleteOTP(email);
//         return;
//     }
//     catch(error){
//        throw error;
//     }
// }



module.exports={
    sendPasswordResetOTPEmail,
    // resetUserPassword
}