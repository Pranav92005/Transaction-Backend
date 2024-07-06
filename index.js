const express=require('express');
const app=express();
const cors=require('cors');
const router=require('./routes/index');

app.use(cors());
app.use(express.json());
app.use('/api/v1',router);















app.listen(3000);