const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
//create product-admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
});
//update product
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("product not found ", 404));
        // return res.status(500).json({
        //     success: false,
        //     message: "product is not found",
        // });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        product,
    });
});
//delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    console.log(product);
    if (!product) {
        return next(new ErrorHandler("product not found ", 404));
        // return res.status(500).json({
        //     success: false,
        //     message: "product is not found",
        // });
    }
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "product deleted",
    });
});
//get one product
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    console.log(product);
    if (!product) {
        return next(new ErrorHandler("product not found ", 404));
        // return res.status(500).json({
        //     success: false,
        //     message: "pdt not found",
        // });
    }
    res.status(200).json({
        success: true,
        product,
    });
});
//get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const product = await Product.find();
    res.status(200).json({ success: true, product });
});
