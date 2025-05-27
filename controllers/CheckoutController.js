import Cart from "../models/Cart.js";
import Checkout from "../models/Checkout.js";
import Order from "../models/Order.js";


export const createCheckout = async(req, res)=>{
    try {
        const {checkoutItems, shippingAddress, paymentMethod, totalPrice} = req.body;
        if(!checkoutItems && checkoutItems.length === 0){
            res.status(404).json({message:'no item in checkout'})
        }

        const checkout = await Checkout.create({
            user:req.user?._id,
            checkoutItems:checkoutItems,
            shippingAddress:shippingAddress,
            paymentMethod:paymentMethod,
            totalPrice,paymentStatus:"Pending",
            isPaid:false,
        })
        console.log('Checkout for user ')
        res.status(201).json(checkout)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message:"Server error"
        })
    }
}

// update checkout
// update checkout to mark as paid after successful payment
// /api/checkout/:id/pay
export const updateCheckout = async(req, res) =>{
    try {
        const {paymentStatus, paymentDetails} = req.body;
        const id = req.params.id;
        const checkout = await Checkout.findById(id);
        if(!checkout) res.status(404).json({message:"Checkout not found"})

        if(paymentStatus === "paid"){
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now()
            const updatedCheckout = await checkout.save();
            res.status(201).json(updatedCheckout);
        }else{
            res.status(400).json({message:"Invalid payment status"})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message:"Server error"
        })
    }
}

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access private
export const finalizeCheckout = async(req, res) =>{
    try {
        const id = req.params.id;
        const checkout = await Checkout.findById(id);
        if(!checkout){
            res.status(404).json({message:"Checkout not found"})
        }

        if(checkout.isPaid && !checkout.isFinalized){
            // create final order based on the checkout details
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems:checkout.checkoutItems,
                shippingAddress:checkout.shippingAddress,
                paymentMethod:checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid:true,
                paidAt:checkout.paidAt,
                isDelivered:false,
                paymentStatus:"paid",
                quantity:checkout.checkoutItems.quantity,
                paymentDetails:checkout.paymentDetails
            })

            //mark the checkout as finalize
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            //delete the product in cart 
            await Cart.findOneAndDelete({user:checkout.user})
            res.status(201).json(finalOrder)

        }else if(checkout.isFinalized){
            res.status(400).json({message:"Checkout already finalized."})
        }else{
             res.status(400).json({message:"Checkout is not paid."})
        }
    } catch (error) {
            console.log(error.message);
            res.status(500).json({
                message:"Server error"
            })
    }
}