import jwt,{ decode } from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async(req, res, next) =>{

        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
           try {
                token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log(decoded)
                req.user = await User.findById(decoded.user.id).select("-password") // exclude password
                next();
           } catch (error) {
                console.log(error.message)
                res.json({
                    "message":"Not authorized , token failed"
                })
           }
        }else{
            res.json({
                "message":"Not authorized , token not provided"
            })
        }
 
}

export const adminOnly = async(req, res, next) =>{
    if(req.user && req.user.role == "admin"){
        next();
    }else{
        res.status(401).json({message:"Not authorized as admin"})
    }
}

export const imageKitAuth = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
}