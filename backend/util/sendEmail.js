const nodemailer=require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    }
});


transporter.verify((error,success)=>{
 if(error){
    console.log(error);
 }else{
    console.log("Ready for message");
    console.log(success);
 }
});


const sendEmail=async(mailOptions)=>{
    try{
       await transporter.sendMail(mailOptions);
       return ;

    }
    catch(error){
      throw error;
    }
}

module.exports={
    sendEmail,
}