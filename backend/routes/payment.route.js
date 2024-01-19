const { PaymentModel } = require("../models/payment.model");
const express = require("express");
const {auth} = require("../middleware/auth.middleware")

const paymentRouter = express.Router();

// paymentRouter.use(auth);


// GET route for user payments . Able to search for coinname using ?q="anycoinname"
// Able to sort by any fields available using ?sort=field&order=asc(or desc) - price,price_change_percentage_24h,marketcap,quantity,paymentType (asc will give buy first desc will give sell)
// Able to apply pagination using ?page=pagenumber&limit=limitperpage

paymentRouter.get("/",async(req,res)=>{
    try {
        let {userID} = {userID:"65a87073f08eb630cb7866f3"} || req.body
        // console.log(userID)
        let query = [{$match:{userID}}];
        // console.log(req.query.q)
        if(req.query.q){
            let search = { coinname: { $regex: new RegExp(`${req.query.q}`, "i") } };
            // console.log(search);
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
            query.push(sortStage)
            
        }
       
        let count = [...query]
        count.push({$count:"total"});
        let total_count = await PaymentModel.aggregate(count);
        
        if(req.query.page){
            let page = (JSON.parse(req.query.page)-1)*JSON.parse(req.query.limit||0);
            query.push({$skip:page});
        }
        if(req.query.limit){
            query.push({$limit:JSON.parse(req.query.limit)});
        }
        let data = query.length>0?await PaymentModel.aggregate(query):await PaymentModel.find();
        res.status(200).json({Message:"All payment details",total:total_count[0].total,Data:data});
    } catch (error) {
        console.log(`${error} here`);
        res.status(400).json({Error:error});
    }
})


// New payment Route
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