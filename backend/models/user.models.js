const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
       type:String,
       required:true
    },
    email:{
     type:String,
     required:true
   },mobile:{
       type:String,
    },
    password:{
       type:String,
       required:true
    },
    age:{
        type:String,
    },
    image:{
        type:String,
        default:"https://firebasestorage.googleapis.com/v0/b/coinsquare-8dc2e.appspot.com/o/default.jpg?alt=media&token=fa163076-3ed8-48b2-875b-3b370c66f251"
    },
    balance:{
        type:Number,
        default:0
    },
    investements:{
        type:Number,
        default:0
    }
   },{
       versionKey:false

})

const UserModel=mongoose.model('user',userSchema);


module.exports={
    UserModel,
}