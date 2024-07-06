const express=require('express');
const { authMiddleware } = require('./authmiddleware');
const bankRouter=express.Router();
const {Account} = require('../db');
const mongoose=require('mongoose');



bankRouter.get('/balance',authMiddleware,async (req,res)=>{
const userid=req.userid;
const account=await Account.findOne({userId:userid});
if(!account){
    return res.status(404).json({message:"Account not found"});}
    res.json({balance:account.balance});


})


bankRouter.post('/transfer',authMiddleware,async (req,res)=>{
const session= await mongoose.startSession();
await session.startTransaction();
const {to,amount}=req.body;
const userid=req.userid;


const account = await Account.findOne({ userId:userid}).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userid }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });




})


module.exports=bankRouter;
