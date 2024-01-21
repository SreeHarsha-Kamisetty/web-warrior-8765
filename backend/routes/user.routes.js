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

// for uploading user profile picture


let admin = require("firebase-admin"); // firebase-admin

let serviceAccount = require("../firebase-admin-details.json"); // file-path for admin details

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://coinsquare-8dc2e.appspot.com', // firebase storage path
});
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


userRouter.patch('/profile/:userID', upload.single('image'), async (req, res) => {
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(`${req.params.userID}.jpg`);

        const metadata = {
            contentType: req.file.mimetype,
        };

        await file.save(req.file.buffer, { metadata });
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '01-01-2030', // Set an expiration date or period as needed
        }); // url for the uploaded image
        
        await UserModel.findByIdAndUpdate({_id:`${req.params.userID}`},{image:url});
        res.status(200).json({ message: 'File uploaded successfully',updated:url});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// route to get user profile picture

userRouter.get("/profile/:userID",async(req,res)=>{
    try {
        let {userID} = req.params
        let user = await UserModel.findOne({_id:userID});
        if(user){
            res.status(200).json({image:user.image|| "https://firebasestorage.googleapis.com/v0/b/coinsquare-8dc2e.appspot.com/o/default.jpg?alt=media&token=fa163076-3ed8-48b2-875b-3b370c66f251"})
        } // If no profile picture then default would be sent 
        else{
            res.status(404).json({Error:"User Not Found"})
        }
    } catch (error) {
        res.status(500).json({Error:error})
    }
})

// Route to add funds -- to be used on purchase coins page during payment 
userRouter.patch("/addfunds/:userID",async(req,res)=>{
    try {
        let {userID} = req.params;

        let amount = Number(req.body.balance);
        let user = await UserModel.findOne({_id:userID});
        let balance = user.balance
        balance+=amount
        await UserModel.findByIdAndUpdate(userID,{balance:balance});
        res.status(200).json({Message:"Balance updated"})
    } catch (error) {
        console.log(error)
        res.status(400).json({Error:error});
    }
})

userRouter.get("/:userID",async(req,res)=>{
    try {
        let id = req.params.userID
        let user = await UserModel.findOne({_id:id});
        if(user){
            res.status(200).json({user});
        }
        else{
            res.status(404).json({Message:"User not found"})
        }
    } catch (error) {
        res.status(400).json({Error:error});
    }
})

// to update the user data
userRouter.patch('/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Check if the user exists
      const user = await  UserModel.findOne({_id:userId});
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update user fields
      if (req.body.name) {
        user.name = req.body.name;
      }
  
      if (req.body.email) {
        user.email = req.body.email;
      }
  
      if (req.body.mobile) {
        user.mobile = req.body.mobile;
      }
  
      if (req.body.age) {
        user.age = req.body.age;
      }
      // Save the updated user
      await user.save();
  
      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = {
    userRouter,
};
