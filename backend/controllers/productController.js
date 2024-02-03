const Product = require("../models/productModels");
const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../Middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

exports.createProduct = catchAsyncError( async (req,res,next)=>{

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    });
});

// get all product
exports.getAllProdutcs = catchAsyncError(async(req,res)=>{

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    const products =  await apiFeature.query;
    res.status(200).json({
        success:true,
        products
    })
});

//get single product details

exports.getProductDetails = catchAsyncError(async (req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product Not Founf",404));
    }
   
    res.status(200).json({
        success:true,
        product,
        productCount
    })

});




exports.updateProduct = catchAsyncError(async (req, res, next) => {
   
        let product = await Product.findById(req.params.id);

        if(!product){
            return next(new ErrorHander("Product Not Founf",404));
        }

        // Update the product properties
        product.set(req.body);
        await product.save();

        res.status(200).json({
            success: true,
            product
        });
});

//delete product

exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product Not Founf",404));
    }
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message: "Product Deleted"
    })
});

