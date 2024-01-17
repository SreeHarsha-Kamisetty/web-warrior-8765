const mongoose=require('mongoose');

const otpSchema=mongoose.Schema({
    email:{
     type:String,
     required:true
   },
    otp:{
        type:String,
        createdAt:Date,
        expiresAt:Date,
    }
   },{
       versionKey:false

})

const OtpModel=mongoose.model('otp',otpSchema);


module.exports={
    OtpModel,
}