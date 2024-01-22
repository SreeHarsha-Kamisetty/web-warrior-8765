const { PaymentModel } = require("../models/payment.model");
const express = require("express");
const {auth} = require("../middleware/auth.middleware");
const { UserModel } = require("../models/user.models");

const paymentRouter = express.Router();

// paymentRouter.use(auth);


// GET route for user payments . Able to search for coinname using ?q="anycoinname"
// Able to sort by any fields available using ?sort=field&order=asc(or desc) - price,price_change_percentage_24h,marketcap,quantity,paymentType (asc will give buy first desc will give sell)
// Able to apply pagination using ?page=pagenumber&limit=limitperpage

paymentRouter.get("/:userID",async(req,res)=>{
    try {
        let {userID} =   req.params 
        // {userID:"65a87073f08eb630cb7866f3"} || 

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
        let total = total_count.length > 0 ? total_count[0].total : 0;
        if(req.query.page){
            let page = (JSON.parse(req.query.page)-1)*JSON.parse(req.query.limit||0);
            query.push({$skip:page});
        }
        if(req.query.limit){
            query.push({$limit:JSON.parse(req.query.limit)});
        }
        let data = query.length>0?await PaymentModel.aggregate(query):await PaymentModel.find();
        res.status(200).json({Message:"All payment details",total:total,Data:data});
    } catch (error) {
        console.log(`${error} here`);
        res.status(400).json({Error:error});
    }
})


// New payment Route
paymentRouter.post("/new",async(req,res)=>{
    try {
        let payload = req.body;
        let total = +payload.price * +payload.quantity
        // console.log(total);
        let new_payment = new PaymentModel(payload);
        await new_payment.save();
        let user = await UserModel.findOne({_id:req.body.userID});
        let new_balance,new_investments;
        if(payload.paymentType=="buy"){
            new_balance = user.balance-total
            new_investments = user.investements+total
        }
        else{
            new_balance = user.balance+total
            new_investments = user.investements-total
        }
        let updated_user = {
            balance:new_balance,
            investements:new_investments
        }
        // console.log(updated_user);
        await UserModel.findByIdAndUpdate({_id:req.body.userID},updated_user)
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
 //payment route for avilable coins in user's account 
paymentRouter.get("/available/:userID/:coin",async(req,res)=>{
    let {userID} = req.params;
    let coin = req.params.coin
    try {
        let bought = await PaymentModel.aggregate([{$match:{userID:userID,paymentType:"buy"}},{$group:{_id:"$coinname",total:{$sum:"$quantity"}}},{$match:{_id:coin}}])
        let sold = await PaymentModel.aggregate([{$match:{userID:userID,paymentType:"sell"}},{$group:{_id:"$coinname",total:{$sum:"$quantity"}}},{$match:{_id:coin}}])
        // console.log(bought[0].total,sold[0].total);
        let available = (bought.length>0?bought[0].total:0)-(sold.length>0?sold[0].total:0)
        res.status(200).json({available})
    } catch (error) {
        console.log(error)
        res.status(400).json({Error:error})
    }
})

paymentRouter.get("/",async(req,res)=>{
    try {
        let userdata = await UserModel.find().count();
        let payment_count = await PaymentModel.find().count();
        let investements = await UserModel.aggregate([
            {
              $group: {
                _id: null,
                total: { $sum: "$investements" }
              }
            }
          ])
          investements = investements[0].total
          res.status(200).json({userdata,payment_count,investements})
          
    } catch (error) {
        res.status(400).json({error})
    }
})


module.exports={
    paymentRouter
}