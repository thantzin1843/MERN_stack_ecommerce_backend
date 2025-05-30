import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

// create order
export const createOrder = async( req, res ) =>{
    try {
        const {orderItems, user, shippingAddress, paymentMethod,totalPrice,
                firstName, lastName, email,phone ,images
        } = req.body;

        const order = await Order.create({
            orderItems,
            user, 
            shippingAddress, 
            paymentMethod,
            totalPrice,
            firstName, lastName, email,phone ,images
        })

        await Cart.deleteOne({user:user})
        res.status(200).json(order)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Fail to save orders"})
    
    }
}
// order list
export const getMyOrders = async(req, res) =>{
    try {
        const {user} = req.query;
        const orders = await Order.find({user:user}).sort({createdAt:-1});
        res.status(200).json(orders);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Fail to get orders"})
    }
}


// order detail
export const getOrderDetail = async(req, res) =>{
    try {
        const id = req.params.id;
        const order = await Order.findById(id)
        if(!order){
            res.status(404).json({message:"Order not found"})
        }
        res.status(200).json(order)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Fail to get order detail."})
    }
}




// -----------------------------------Admin Functions----------------------------------------------------------------
// update order status
export const updateOrderStatus = async(req, res) =>{
    try {
        const {status, orderId} = req.body;
        const order = await Order.findById(orderId);
        if(!order){
            res.status(404).json({message:"Order not found"})
        }
        order.status = status;
        const updatedOrder = await order.save();
        res.status(201).json(updatedOrder)
    } catch (error) {
         console.log(error.message);
        res.status(500).json({message:"Fail to update order status."})
    }
}

// all orders
export const getAllOrders = async(req, res) =>{
    try {
        const orders = await Order.find().sort({createdAt:-1});
        res.status(200).json(orders);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Fail to get admin orders"})
    }
}

