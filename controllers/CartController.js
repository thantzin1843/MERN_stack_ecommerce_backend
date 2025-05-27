import express from 'express'
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const getCart = async(userId) =>{
        return await Cart.findOne({user:userId});
}

export const createCart = async(req,res)=>{
    try {
        const {productId, quantity, size, color, userId,image,name,price,totalPrice,hasVariants,discountPrice,stockLimit} = req.body;
        // 
        const product = await Product.findById(productId);
        if(!product){
            res.status(404).json({
                message:"Product Not Found"
            })
        }
        // Determine if the user is logged in or guest
        let cart = await getCart(userId);
        // if cart exit update it
        if(cart){
            const productIndex = cart.products.findIndex((p)=>{
                if(hasVariants){
                    return p.productId.toString()== productId && p.size === size && p.color === color
                }else{
                    return p.productId.toString()== productId 
                }
            })
        
            if(productIndex > -1){
                // if product already exist
                cart.products[productIndex].quantity += quantity;
            } else{
                cart.products.push({
                    productId,
                    name:name,
                    image:image,
                    size,
                    quantity,
                    color,
                    price:price,
                    discountPrice,
                    stockLimit
                })
            }

            // recalculate the total price
            cart.totalPrice  = cart.products.reduce((acc, item) => {
                                const price = Number(item.price) || 0;
                                const quantity = Number(item.quantity) || 0;
                                const discountPrice1 = Number(item.discountPrice) || 0;
                                return acc + ((price * quantity)*(1-(discountPrice1/100)));
                                }, 0);
            await cart.save();
            // console.log(cart)
            return res.status(200).json(cart)
        }  else{
            // create new cart
            const newCart = await Cart.create({
                user:userId,
                products:[
                    {
                        productId, 
                        name:name,
                        image: image,
                        price:price,
                        size,color,quantity,discountPrice,stockLimit
                    }
                ],
                totalPrice: totalPrice,
                
            })
            return res.status(201).json(newCart)
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message:"fail to add to cart"
        })
    }
}

// update cart quantity
export const updateCart = async(req, res) =>{
    try {
        const {productId, size, color, quantity , userId ,action} = req.body;

        // get cart with user logged in or guest
        const cart = await getCart(userId);
        if(cart){
            const productIndex = cart.products.findIndex((p)=>(
                p.productId.toString() === productId && p.color == color && p.size == size 
            ))

            if(productIndex > -1){ // if 
                // if(quantity > 0){
                //     cart.products[productIndex].quantity += 1;
                // }else{
                //     cart.products.splice(productIndex, 1) // remove the product if quantity is 0
                // }
                if(action == 'plus'){
                    cart.products[productIndex].quantity += 1;
                }

                if(action == 'minus'){
                    if(cart.products[productIndex].quantity > 1) {
                        cart.products[productIndex].quantity -= 1;
                    }else{
                        cart.products.splice(productIndex, 1)
                    }
                }
            }

            // calculate total price
            cart.totalPrice  = cart.products.reduce((acc, item) => {
                                const price = Number(item.price) || 0;
                                const quantity = Number(item.quantity) || 0;
                                const discountPrice = Number(item.discountPrice) || 0;
                                return acc + ((price * quantity)*(1-(discountPrice/100)));
                                }, 0);
            await cart.save();
            res.status(201).json(cart)
            }else{
                res.status(404).json({
                    message:"Cart Not Found"
                })
            }
    } catch (error) {
            console.log(error.message)
            res.status(500).json({
                message:"fail to add to cart"
            })
    }
}

// delete item from cart
export const deleteCartProduct = async(req, res) =>{
    try {
        const {productId , size, color , userId} = req.body;
        const cart = await getCart(userId);
        if(!cart){
             res.status(404).json({
                message:"Cart not found"
            })
        }
        console.log(productId, size, color,userId)
        const productIndex = cart.products.findIndex((p)=>(
            p.productId.toString() === productId && p.size == size && p.color==color 
        ))
        console.log(productIndex)
        if(productIndex > -1) {
            cart.products.splice(productIndex,1)
        }

        // cart.totalPrice = cart.products.reduce((acc, item)=>acc+item.price*item.quantity, 0)
        // recalculate the total price
            cart.totalPrice  = cart.products.reduce((acc, item) => {
                                const price = Number(item.price) || 0;
                                const quantity = Number(item.quantity) || 0;
                                const discountPrice = Number(item.discountPrice) || 0;
                                return acc + ((price * quantity)*(1-(discountPrice/100)));
                                }, 0);
        await cart.save()

        res.status(200).json(cart)
    } catch (error) {
            console.log(error.message)
            res.status(500).json({
                message:"fail to add to cart"
            })
    }
}

export const getCartDetails = async(req, res)=>{
    try {
        const {userId} = req.query;
        const cart = await getCart(userId);
        if(!cart){
             res.status(404).json({
                message:"Cart not found"
            })
        }
        res.status(200).json(cart);
    } catch (error) {
            console.log(error.message)
            res.status(500).json({
                message:"Cart not found"
            })
    }
}
