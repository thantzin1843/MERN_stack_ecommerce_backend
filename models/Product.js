import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
    },
    variants:[
        {
            size:String,
            color:String,
            price:Number,
            discountPrice:Number,
            stock:Number
        }
    ],
    price:{
        type:Number,
        // required:true,
    },
    discountPrice:{
        type:Number,
    },
    countInStock:{
        type:Number,
        // required:true,
        default:0
    },
    sku:{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        required:true,
    },
    brand:{
        type:String,
    },
    collection:{
        type:String, // eg summer collection
    },
    gender:{
        type:String,
        enum: ["Male","Female","Unisex"]
    },
    images:[String],
    isPublished:{
        type:Boolean,
        default:false
    },
    hasVariants:{
        type:Boolean,
        default:true
    },
    rating:{
        type:Number,
        default:0
    },
    // numReviews:{
    //     type:Number,
    //     default:0
    // },
    tags:[String],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },

    dimensions:{
        length:Number,
        width:Number,
        height:Number,
    },
    weight:Number,
},{timestamps:true})

const Product = mongoose.models?.Product || mongoose.model("Product", productSchema);
export default Product;