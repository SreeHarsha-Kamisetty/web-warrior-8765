const mongoose = require("mongoose")

const connection = mongoose.connect("mongodb+srv://sreeharsha:sreeharsha@cluster0.ybpcjrc.mongodb.net/coinsquare?retryWrites=true&w=majority");

module.exports={
    connection
}