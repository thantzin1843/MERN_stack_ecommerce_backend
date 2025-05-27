import express from 'express'
import { adminOnly, protect } from '../middlewares/AuthMiddleware.js'
import Collection from '../models/Collection.js';

const collectionRouter = express.Router()

collectionRouter.get('/',async(req,res)=>{
    try {
        const collections = await Collection.find()
        res.status(201).json(collections);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({"message":"fail to fetch collection"})
    }
})

collectionRouter.post("/",protect,adminOnly,async(req,res)=>{
    try {
        const {name } =req.body;
        const collection = await Collection.create({
            name
        })
        res.status(201).json(collection);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({"message":"fail to save collection"})
    }
})

export default collectionRouter