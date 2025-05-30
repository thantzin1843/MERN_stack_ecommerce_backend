import express from 'express'
import { changePassword, changeUserRole, getAllUsers, getDashboardData, getProfile, login, register, updateUserName } from '../controllers/UserController.js';
import { adminOnly, protect } from '../middlewares/AuthMiddleware.js';


const userRouter = express.Router();



userRouter.post('/register', register);
userRouter.post('/login',login);
userRouter.get('/profile',protect,getProfile);

userRouter.put('/update_profile',protect,updateUserName);
userRouter.put('/change_password',protect,changePassword);
userRouter.put('/change-role',protect,adminOnly,changeUserRole);
userRouter.get('/',protect,adminOnly,getAllUsers);

userRouter.get('/dashboard',protect,adminOnly, getDashboardData);

export default userRouter