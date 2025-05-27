import mongoose from "mongoose";


const orderItemSchema = new mongoose.Schema({
     productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    name:{
        type:String,
    },
    image:{
        type:String,
    },
    price:{
        type:Number,
    },
    discountPrice:{
        type:Number,
    },
    stockLimit:{
        type:Number,
    },
    size:{
        type:String,
    },
    color:{
        type:String,
    },
    quantity:{
        type:Number,
        default:1
    },

},{_id:false})

const orderSchema = new mongoose.Schema({
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true
    },
    images:[String],
    shippingAddress:{
        address:{type:String,required:true,},
        city:{type:String,required:true,},
        postalCode:{type:String,required:true,},
        country:{type:String,required:true,},
    },
    orderItems:[orderItemSchema],
    paymentMethod:{  // kbz, aya , etc...
        type:String,
        required:true,
    },
    totalPrice:{
        type:Number,
        required:true
    },
    isDelivered:{
        type:Boolean,
        default:false
    },
    deliveredAt:{
        type:Date,
    },
    status:{
        type:String,
        enum:['Pending','Processing','Delivered','Cancelled'],
        default:"Pending"
    }
},{timestamps:true})

const Order = mongoose.models?.Order || mongoose.model("Order",orderSchema);
export default Order;