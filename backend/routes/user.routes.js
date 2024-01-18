const express = require('express');
const { UserModel } = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const { BlackListModel } = require('../models/blacklist.models');
const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    try {
        const { name, email, mobile, password, age } = req.body;

        if (!(name && email && password)) {
            return res.status(400).json({ msg: "Empty input field" });
        } else if (password.length < 8) {
            return res.status(400).json({ msg: "Password is too short" });
        }

        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        bcrypt.hash(password, 3, async (err, hash) => {
            if (err) {
                return res.status(500).json({ msg: "Error hashing password" });
            }

            const newUser = new UserModel({ name, email, password: hash, mobile, age });
            await newUser.save();

            res.status(200).json({ msg: "New user has been registered", user: newUser });
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error });
    }
});


//login
userRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email && password){
            res.status(400).json({msg:"Please enter all field"})
        }
          const user=await UserModel.findOne({email});
           if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    const access_token=jwt.sign({userID:user._id,user:user.name},"masai");
                    res.status(200).json({msg:"Login successfull",access_token,user})
                }else{
                    res.status(200).json({msg:"Please Register,Wrong Credentials"})
                }
            })
           }else{
            res.status(200).json({msg:"Please Register,Wrong Credentials"})
            // res.status(200).json({error:err});
           }
    }
    catch(err){
        res.status(400).send(err);
    }
})


//logout
userRouter.get('/logout',async(req,res)=>{
    const access_token=req.headers.authorization?.split(" ")[1];
    try{
        const blacklist=new BlackListModel({access_token:access_token});
        await blacklist.save();
        res.status(200).json({msg:"Hey! user you are logout"});
    }
    catch(err){
        res.status(400).json({err:err});
    }
})










module.exports = {
    userRouter,
};
