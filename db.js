
const mongoose=require('mongoose');
const MONGODB_CONNECT_URI=process.env.MONGODB_CONNECT_URI;
mongoose.connect( MONGODB_CONNECT_URI);

const userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        minLength:5,
        maxLength:30,
        trim:true
    },
    firstname:{
        type:String,
        required:true,
        maxLength:50,
        trim:true
     },
    lastname:{
        type:String,
        required:true,
        maxLength:50,
        trim:true
        
    },
    password:{
        type:String,
        required:true,
        minLength:6
        
    },
    }
);

const bankSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
type:Number,
required:true
    }
})






const User=mongoose.model('User',userschema);
const Account=mongoose.model('Account',bankSchema);






module.exports={User,Account};