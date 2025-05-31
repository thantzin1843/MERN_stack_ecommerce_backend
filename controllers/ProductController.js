import { populate } from "dotenv";
import Product from "../models/Product.js";

export const createProduct = async(req, res)=>{
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            variants,
            collection,
            gender,
            images,
            hasVariants,
            isPublished,
            tags,
            dimensions,
            weight,
        } = req.body;

        const newProduct = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            variants,
            collection,
            gender,
            images,
            hasVariants,
            isPublished,
            tags,
            dimensions,
            weight,
            user:req?.user?._id
        })

        const createdProduct = await newProduct.save();
        res.status(201).json({
            createProduct:createdProduct, message:"Product created successfully!"
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            'message':'failed to create product'
        })
    }
}


// update 
export const updateProduct = async(req, res) =>{
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            variants,
            collection,
            gender,
            images,
            hasVariants,
            isPublished,
            tags,
            dimensions,
            weight,
        } = req.body;

        const product = await Product.findById(req.params.id);
        if(!product){
            res.status(404).json({
                message:"Product Not Found"
            })
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discountPrice = discountPrice || product.discountPrice;
        product.countInStock = countInStock || product.countInStock;
        product.sku = sku || product.sku;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.variants = variants || product.variants;
        product.hasVariants = hasVariants || product.hasVariants;
        product.collection = collection || product.collection;
        product.gender = gender || product.gender;
        product.images = images || product.images;
        product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
        product.tags = tags || product.tags;
        product.dimensions = dimensions || product.dimensions;
        product.weight = weight || product.weight;

        const updatedProduct = await product.save()
        console.log(updatedProduct);
        res.status(201).json({
            updatedProduct:updatedProduct, message:"Product updated successfully!"
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message:"Fail to update"
        })
    }
}

export const deleteProduct = async(req, res) =>{
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.status(200).json({
            message:"Product deleted successfully!"
        })
        }else{
            res.status(404).json({
             message:"Product Not found!"
        })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message:"Fail to update"
        })
    }
}

export const getAllProducts = async(req, res) =>{
    try {
        const {
        collection, sizes, color, gender, minPrice, maxPrice, sortBy,
        search, material, brand, category, limit
        } = req.query;

        const sizeArray = sizes ? sizes.split(',') : [];
        const min = minPrice ? Number(minPrice) : null;
        const max = maxPrice ? Number(maxPrice) : null;

        const query = { $and: [] };

        // 1. Direct fields
        if (collection && collection.toLowerCase() !== 'all') query.$and.push({ collection });
        if (category && category.toLowerCase() !== 'all') query.$and.push({ category });
        if (material) query.$and.push({ material: { $in: material.split(',') } });
        if (brand) query.$and.push({ brand: { $in: brand.split(',') } });
        if (gender) query.$and.push({ gender });

        // 2. Search
        if (search) {
        query.$and.push({
            $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
            ]
        });
        }

        // 3. Price filtering logic (works for both price and variants)
        const priceConditions = [];
        const noVariantPrice = { price: { $ne: 0 } };
        if (min !== null || max !== null) {
        if (min !== null) noVariantPrice.price.$gte = min;
        if (max !== null) noVariantPrice.price.$lte = max;
        }
        priceConditions.push(noVariantPrice);

        const variantPriceMatch = { price: 0 };
        const variantPriceCondition = {};
        if (min !== null) variantPriceCondition.$gte = min;
        if (max !== null) variantPriceCondition.$lte = max;
        if (Object.keys(variantPriceCondition).length > 0) {
        variantPriceMatch.variants = {
            $elemMatch: { price: variantPriceCondition }
        };
        }
        priceConditions.push(variantPriceMatch);

        query.$and.push({ $or: priceConditions });

        // 4. Variant matching (color & size)
        if (color || sizeArray.length > 0) {
        const variantMatch = {};

        if (color) variantMatch.color = color;
        if (sizeArray.length > 0) variantMatch.size = { $in: sizeArray };

        query.$and.push({
            variants: {
            $elemMatch: variantMatch
            }
        });
        }

        // 5. Sorting
        let sort = {};
        switch (sortBy) {
        case "priceAsc":
            sort = { price: 1 };
            break;
        case "priceDesc":
            sort = { price: -1 };
            break;
        case "popularity":
            sort = { rating: -1 };
            break;
        default:
            break;
        }

        // 6. Final fetch
        const products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("server error")
    }
}

// Get all prodcuts by admin

// best seller product
export const getBestSellerProducts = async(req, res) =>{
    try {
        const product = await Product.findOne().sort({rating:-1})
        if(!product){
            res.status(404).json({
                message:"Best Seller not found"
            })

        }
        const similarProducts = await Product.find({
            _id: {$ne: product._id},
            category:product?.category,
            gender:product?.gender
        }).limit(4)
        console.log(similarProducts);
        res.json({
            product:product,similarProducts:similarProducts
        })
    } catch (error) {
            console.log(error.message);
            res.status(500).send("server error")
    }
}

// get product details
export const getProductDetails = async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        if(!product){
             res.status(404).json({
                message:"Product Not Found"
            })
        }

        // get similar products based on 
        const similarProducts = await Product.find({
            _id: {$ne: id},
            category:product?.category,
            gender:product?.gender
        }).limit(4)
        console.log(similarProducts);
        res.json({
            product:product,similarProducts:similarProducts
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send("fail to fetch product detail")
    }
}



// new-arrivals
export const getNewArrivals = async(req, res) =>{
    try {
        const newArrivalProducts = await Product.find().sort({createdAt:-1}).limit(8);
        res.status(200).json(newArrivalProducts);
    } catch (error) {
         console.log(error.message)
        res.status(500).send("fail to fetch new arrival product ")
    }
}