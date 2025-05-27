
import express from 'express'
import { createCart, deleteCartProduct, getCartDetails, updateCart } from '../controllers/CartController.js';
import { protect } from '../middlewares/AuthMiddleware.js';

const cartRouter = express.Router();


//  /api/cart
// add a product to the cart for a guest or logged in user
cartRouter.post('/',protect,createCart);
cartRouter.put('/',protect,updateCart);
cartRouter.delete('/',protect, deleteCartProduct);
cartRouter.get('/',protect,getCartDetails);

export default cartRouter;