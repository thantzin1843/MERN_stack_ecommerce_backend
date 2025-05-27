import mongoose from "mongoose"

const categroySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
},{timestamps:true})

const Category = mongoose.models?.Category || mongoose.model("Category",categroySchema)
export default Category;