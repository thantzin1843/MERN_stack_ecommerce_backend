import express from 'express'
import dotenv from 'dotenv'
import ImageKit from 'imagekit';
import { imageKitAuth } from '../middlewares/AuthMiddleware.js';

const uploadRouter = express.Router();
dotenv.config()

const imagekit = new ImageKit({
  urlEndpoint: 'https://ik.imagekit.io/9ricnqgce', // https://ik.imagekit.io/your_imagekit_id
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});


uploadRouter.get('/', imageKitAuth, function (req, res) {
  // Your application logic to authenticate the user
  // For example, you can check if the user is logged in or has the necessary permissions
  // If the user is not authenticated, you can return an error response
  const { token, expire, signature } = imagekit.getAuthenticationParameters();
  res.send({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY });
});

export default uploadRouter;