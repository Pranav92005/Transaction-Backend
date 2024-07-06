const express=require('express');
const userRouter=express.Router();
const zod=require('zod');
const {User} = require('../db');
const jwt=require('jsonwebtoken');
const {Account} = require('../db');
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('./authmiddleware');

const userSchema=zod.object({
    username:zod.string().email(),
    firstname:zod.string().max(50),
    lastname:zod.string().max(50),
    password:zod.string().min(6)

})







userRouter.post('/signup',async (req,res)=>{
const userpayload=userSchema.safeParse(req.body);
if(!userpayload.success){
    return res.status(411).json({message:"Invalid payload"});
}
const existinguser=await User.findOne(User.findOne({username:req.body.username}));

if(existinguser){
    return res.status(411).json({message:"Username already exists"});
}


    const user= await User.create({
username:req.body.username,
firstname:req.body.firstname,
lastname:req.body.lastname,
password:req.body.password
    })
    const userid=user._id;

    await Account.create({
     userId: userid  ,
        balance: 1 + Math.random() * 10000
    })

    const token=jwt.sign({userid},JWT_SECRET)

    res.json({
        messge:"user created successfully",
        token:token});
        
    

}
)

const usersigninschema=zod.object({
    username:zod.string().email(),
    password:zod.string().min(6)
})

userRouter.post('/signin',async (req,res)=>{
const parsedpayload=usersigninschema.safeParse(req.body);
if(!parsedpayload.success){
    return res.status(411).json({message:"Invalid payload"});}
    const user=await User.findOne({username:req.body.username});
    if(!user){
        return res.status(403).json({message:"User not found"});
    }
    if(user.password!==req.body.password){
        return res.status(403).json({message:"Invalid password"});
    }
    const token=jwt.sign({userid:user._id},JWT_SECRET);
    res.json({
        message:"User signed in successfully",
        token:token
    })})
const updateSchema=zod.object({
    
    firstname:zod.string().optional(),
    lastname:zod.string().optional(),
    password:zod.string().min(6)

})
userRouter.put('/update',authMiddleware, async (req,res)=>{
    const userpayload=updateSchema.safeParse(req.body);
    if(!userpayload.success){
        return res.status(411).json({message:"Invalid payload"});
    }
    const user=await User.updateOne({_id:req.userid},req.body);

    res.json({message:"User updated successfully"});

})


userRouter.get('/bulk',authMiddleware,async (req,res)=>{
    const filter = req.query.filter || "";

    try{

    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        }, {
            lastname: {
                "$regex": filter
            }
        }]
    })
    

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })}

    catch(err){
        res.status(500).json({message:"Internal server error"})
    }
})

module.exports=userRouter;
