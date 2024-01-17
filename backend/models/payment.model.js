const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
      coinname:String,
      image:String,
      price:Number,
      price_change_percentage_24h:Number,
      marketcap:Number,
      userID:String,
      paymentType:String
},{versionKey:false})

const PaymentModel = mongoose.model("payment",paymentSchema);


module.exports={
    PaymentModel
}