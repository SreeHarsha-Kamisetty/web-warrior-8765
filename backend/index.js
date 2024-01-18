const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const {userRouter}=require('./routes/user.routes')
const {otpRouter}=require('./routes/otp.routes')
const { paymentRouter } = require("./routes/payment.route");
const { forgotPassRouter } = require("./routes/forgotPassword.routes");
require('dotenv');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/payments",paymentRouter);
app.use("/user",userRouter);
app.use('/otp',otpRouter)
app.use('/forget_password',forgotPassRouter)
app.get("/",(req,res)=>{
    res.send("home");
})
app.listen(PORT,async()=>{
    try {
        await connection
        console.log("connected to DB");
        console.log(`Server is running at http://localhost:${PORT}`);
    } catch (error) {
        console.log(error);
    }
})