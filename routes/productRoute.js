import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getBestSellerProducts, getNewArrivals, getProductDetails, updateProduct } from '../controllers/ProductController.js';
import { adminOnly, protect } from '../middlewares/AuthMiddleware.js';

const productRouter = express.Router();

productRouter.post('/create',protect ,adminOnly,createProduct);
productRouter.put('/:id',protect,adminOnly,updateProduct);
productRouter.delete("/:id",protect, adminOnly, deleteProduct);

productRouter.get('/',getAllProducts);
productRouter.get('/best-seller',getBestSellerProducts);
productRouter.get('/new-arrivals',getNewArrivals);
productRouter.get('/:id',getProductDetails);

export default productRouter