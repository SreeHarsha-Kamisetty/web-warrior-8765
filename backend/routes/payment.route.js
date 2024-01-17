const { PaymentModel } = require("../models/payment.model");
const express = require("express");


const paymentRouter = express.Router();



paymentRouter.post("/new",async(req,res)=>{
    try {
        let payload = req.body;
        let new_payment = new PaymentModel(payload);
        await new_payment.save();
        res.status(200).json({Message:"Payment Successful",Details:new_payment});

    } catch (error) {
        res.status(400).json({Error:error});
    }
})






module.exports={
    paymentRouter
}