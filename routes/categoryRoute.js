import express from 'express'
import { adminOnly, protect } from '../middlewares/AuthMiddleware.js'
import Category from '../models/Category.js';

const categoryRouter = express.Router()

categoryRouter.get('/',async(req,res)=>{
    try {
        const categories = await Category.find()
        res.status(201).json(categories);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({"message":"fail to fetch category"})
    }
})

categoryRouter.post("/",protect,adminOnly,async(req,res)=>{
    try {
        const {name } =req.body;
        const category = await Category.create({
            name
        })
        res.status(201).json(category);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({"message":"fail to save category"})
    }
})

export default categoryRouter