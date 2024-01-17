const { PaymentModel } = require("../models/payment.model");
const express = require("express");


const paymentRouter = express.Router();

paymentRouter.get("/",async(req,res)=>{
    try {
        let query = [{_id:"123"}];
        console.log(req.query.q)
        if(req.query.q){
            let search = { coinname: { $regex: new RegExp(`${req.query.q}`, "i") } };
            console.log(search);
            query.push({$match:search});
           
        }
        else if(req.query.sort){
            let type=1 ;
            if(req.query.order == "desc"){
                type=-1
            }
            let sortBy = req.query.sort
            let sortStage = {$sort:{}};
            sortStage.$sort[sortBy] =type
            query = [sortStage];
        }
        if(req.query.page){
            let page = (JSON.parse(req.query.page)-1)*JSON.parse(req.query.limit);
            query.push({$skip:page});
        }
        if(req.query.limit){
            query.push({$limit:JSON.parse(req.query.limit)});
        }
        let data = query.length>0?await PaymentModel.aggregate(query):await PaymentModel.find();
        res.status(200).json({Message:"All payment details",Data:data});
    } catch (error) {
        console.log(error);
        res.status(400).json({Error:error});
    }
})

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