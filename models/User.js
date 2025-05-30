import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unique: true,
        trim:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        require:true,
        minLength:6,
    },
    role:{
        type:String,
        require:true,
        enum: ["customer","admin"],
        default:'customer'
    },
    profile:{
        type:String, 
        default:"/profileAvatar.jpg"
    }
},{timestamps:true})

export const User = mongoose.models?.User || mongoose.model("User",userSchema)