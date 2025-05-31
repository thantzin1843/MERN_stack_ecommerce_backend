import express from 'express'
import { connectToDB } from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv'
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import checkoutRouter from './routes/checkoutRoute.js';
import orderRouter from './routes/orderRoute.js';
import uploadRouter from './routes/imageUploadRoute.js';
import subscriberRouter from './routes/subscriberRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import collectionRouter from './routes/collectionRoute.js';
// db 
const app = express();
app.use(express.json());
app.use(cors());
// app.use(cors({
//   origin: 'https://mern-stack-ecommerce-frontend-xi.vercel.app'
// }))

dotenv.config()
const PORT = process.env.PORT || 3000;

await connectToDB();
app.get('/',(req,res)=>{
    res.send("Welcome express")
})

// /api/user/...
app.use('/api/user',userRouter)
app.use('/api/products',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/checkout',checkoutRouter)
app.use('/api/orders',orderRouter)
app.use('/api/subscriber',subscriberRouter)
app.use('/api/category',categoryRouter)
app.use('/api/collection',collectionRouter)
// for image kit
app.use('/auth',uploadRouter)

app.listen(PORT, ()=>{
    console.log(`Server is listening on http://localhost:${process.env.PORT}`)
})