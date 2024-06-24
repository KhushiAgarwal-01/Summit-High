import express from 'express';
import mongoose from 'mongoose';
import dotenv from'dotenv';
dotenv.config();
import userRouter from "./routes/user.route.js"
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser';




mongoose.connect(process.env.MONGO)
.then(()=>console.log("connected to db"))
.catch((error)=>console.log({error:error}))

const app=express();

app.use(express.json());

app.use(cookieParser());

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)


app.use((err,req,res,next)=>{
const statusCode=err.statusCode||500;
const message=err.message ||'Internal server error';
return res.status(statusCode).json({
    success:false,
    statusCode,
    message,
})
})


app.listen(3000,()=>{
    console.log('server running on 3000')
})
