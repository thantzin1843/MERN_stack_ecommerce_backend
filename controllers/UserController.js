import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
export const register = async (req,res)=>{
    const {name, email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
           return res.status(400).json({"message":"This email is already register"})
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
        if(!user) res.status(400).json({"message":"User Not Found"});

        const matchPassword = await bcrypt.compare(password, user.password);
        // console.log(matchPassword)
        if(!matchPassword){
            res.status(400).json({"message":"Password Incorrect"});
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