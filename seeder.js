
import dotenv from 'dotenv';
import { connectToDB } from './config/db.js';
import Product from './models/Product.js';
import { User } from './models/User.js';
import { products } from './data/Products.js';
import bcrypt from 'bcryptjs';
import Cart from './models/Cart.js';

dotenv.config()

export const seedData = async() =>{
    try {
        await connectToDB();

        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt)

        const user = await User.create({
            "name":"admin",
            "email":"admin@example.com",
            "password":hashedPassword,
            "role":"admin"
        })

        // const sampleProducts = products.map((p)=>{
        //     return {...p, user:user._id}
        // })
        // await Product.insertMany(sampleProducts);
        console.log("products data are seeded.")
        process.exit()


    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }

}

seedData()