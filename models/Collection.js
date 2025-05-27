import mongoose from "mongoose"

const collectionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
},{timestamps:true})

const Collection = mongoose.models?.Collection || mongoose.model("Collection",collectionSchema)
export default Collection;