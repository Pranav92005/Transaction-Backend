const express=require('express');
const router=express.Router();
const userRouter=require('./user');
const bankRouter=require('./account');

router.use('/user',userRouter);
router.use('/account',bankRouter);




module.exports=router;
