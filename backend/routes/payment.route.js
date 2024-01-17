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

paymentRouter.patch("/update/:id",async(req,res)=>{
    try {
        let id = req.params.id;
        let payload = req.body
        let updatedDetails = await PaymentModel.findByIdAndUpdate({_id:id},payload,{new:true});
        res.status(200).json({Message:"Payment Details updated",Details:updatedDetails});
    } catch (error) {
        res.status(400).json({Error:error});
    }
})

paymentRouter.delete("/delete/:id",async(req,res)=>{
    try {
        let id = req.params.id;
        
        await PaymentModel.findByIdAndDelete({_id:id});
        res.status(200).json({Message:"Payment Details deleted"});
    } catch (error) {
        res.status(400).json({Error:error});
    }
})






module.exports={
    paymentRouter
}