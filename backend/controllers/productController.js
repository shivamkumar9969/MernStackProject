const Product = require("../models/productModels");


exports.createProduct = async (req,res,next)=>{
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
}

// get all product
exports.getAllProdutcs =  async(req,res)=>{
    const products =  await Product.find();
    res.status(200).json({
        success:true,
        products
    })
}

//get single product details

exports.getProductDetails = async (req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not found" 
        })
    }
   
    res.status(200).json({
        success:true,
        product
    })

}




exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Update the product properties
        product.set(req.body);
        await product.save();

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

//delete product

exports.deleteProduct = async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not found" 
        })
    }
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message: "Product Deleted"
    })
}

