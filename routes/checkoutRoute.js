import express from 'express'
import { createCheckout, finalizeCheckout, updateCheckout } from '../controllers/CheckoutController.js';
import {protect} from '../middlewares/AuthMiddleware.js'

const checkoutRouter = express.Router();

checkoutRouter.post('/',protect,createCheckout);
checkoutRouter.put('/:id/pay',protect, updateCheckout);
checkoutRouter.post('/:id/finalize',protect,finalizeCheckout);

export default checkoutRouter