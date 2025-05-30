import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
export const register = async (req,res)=>{
    const {name, email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
           return res.status(400).json({"message":"This email is already register","status":400})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        user = new User({
            name, email, password:hashedPassword
        })

        await user.save();

        // jwt
        const payload = {user:{id:user._id, role:user.role}}
        jwt.sign(payload,process.env.JWT_SECRET,(err,token)=>{
            if(err) throw err;
            res.status(201).json({
                user:{
                    _id:user.id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                },
                token
            })
        })

    } catch (error) {
        console.error(error.message)
    }
}

export const login = async(req,res)=>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) res.status(400).json({"message":"User Not Found","status":400});

        const matchPassword = await bcrypt.compare(password, user.password);
        // console.log(matchPassword)
        if(!matchPassword){
            res.status(400).json({"message":"Password Incorrect","status":400});
        }

        const payload = {user:{id:user._id, role:user.role}}
        jwt.sign(payload, process.env.JWT_SECRET, (err,token)=>{
            if(err) throw err
            res.status(200).json({
                user:{
                    _id:user.id,
                     name:user.name,
                    email:user.email,
                    role:user.role
                },
                token
            })
        })
    } catch (error) {
        console.log(error.message)
    }
}


export const getProfile =async(req, res)=>{
     res.json(req.user);
}

export const changeUserRole = async(req, res) =>{
    try {
        const {userId, role} = req.body;
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({
            message:"User not found"
        })
        }

        user.role = role;
        const updatedUser = await user.save();
        res.status(201).json(updatedUser)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message:"Fail to change user role"
        })
    }
}

export const updateUserName = async(req, res) =>{
    try {
        const {name,profile} = req.body;
        const user = await User.findById(req.user?._id);
        if(!user){
            res.json({
                "message":"User not found"
            })
        }

        if(name){
            user.name = name;
        }
        if(profile){
            user.profile = profile;
        }
        const updatedUser = await user.save();
        res.json(updatedUser)
    } catch (error) {
        
    }
}

export const changePassword = async(req,res) =>{
    try {
        const {oldPassword, newPassword} = req.body;
        const user = await User.findById(req.user._id);
        const matchOldPassword = await bcrypt.compare(oldPassword, user?.password);
        if(matchOldPassword){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword,salt);
            user.password = hashedPassword;
            await user.save()
            res.status(201).json({
                "message":"Password successfully changed."
            })
        }
            res.status(500).json({
                "message":"Old password is wrong!"
            })
    } catch (error) {
        res.status(500).json({
                "message":"Password can't changed."
            })
    }
}

export const getAllUsers = async(req, res) =>{
    try {
        const users = await User.find();
        console.log(users)
        res.status(200).json(users)
    } catch (error) {
        
    }
}

export const getDashboardData = async(req, res) =>{
    try {
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const userCount = await User.countDocuments();

            const result = await Order.aggregate([
            {
                $match: {
                status: { $nin: ['Pending', 'Cancelled'] } // exclude these statuses
                }
            },
            {
                $group: {
                _id: null,
                totalSales: { $sum: '$totalPrice' }
                }
            }
            ]);

            const total = result[0]?.totalSales || 0;

        res.json({productCount,orderCount,userCount,total})
    } catch (error) {
        
    }
}