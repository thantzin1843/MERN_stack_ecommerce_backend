import express from 'express'
import { changeUserRole, getProfile, login, register } from '../controllers/UserController.js';
import { adminOnly, protect } from '../middlewares/AuthMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login',login);
userRouter.get('/profile',protect,getProfile);

userRouter.put('/change-role',protect,adminOnly,changeUserRole);

export default userRouter