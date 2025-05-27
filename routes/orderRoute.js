import express from 'express'
import { createOrder, getAllOrders, getMyOrders, getOrderDetail, updateOrderStatus } from '../controllers/OrderController.js';
import { adminOnly, protect } from '../middlewares/AuthMiddleware.js';

const orderRouter = express.Router();

orderRouter.post('/',protect,createOrder);
// -----------------------------------Admin Routes----------------------------------------------------------------
orderRouter.put('/change-status',protect,adminOnly,updateOrderStatus);
orderRouter.get('/admin-orders',protect, adminOnly,getAllOrders);

// -----------------------------------Customer Routes----------------------------------------------------------------
orderRouter.get('/my-orders',protect,getMyOrders);
orderRouter.get('/:id',protect,getOrderDetail);



export default orderRouter;