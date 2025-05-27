import express from "express"
import { Subscriber } from "../models/Subscriber.js";

const subscriberRouter = express.Router();
subscriberRouter.post('/save',async(req , res)=>{
    try {
        const {email} = req.body;
        if(!email){
            res.status(400).json("Need to provide email");
            return;
        }
        const subscriber = await Subscriber.findOne({email:email});
        if(subscriber){
            res.status(400).json("Email already subscribed!");
            return;
        }

        await Subscriber.create({
            email,
            subscribedAt:Date.now()
        })
        res.status(200).json({message:"Successfully subscribed."});
    } catch (error) {
        
    }
})

export default subscriberRouter;