const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
exports.createProduct = catchAsyncErrors(async (req,res,next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success:true,
    product,
  });
});
exports.getAllProducts = catchAsyncErrors(async (req,res) => {
  const apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter();
  const products = await apiFeatures.query;
  res.status(200).json({
    success:true,
    products,
  });
});
exports.getProductDetails = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({
      success:true,
      product,
    });
});
exports.updateProduct = catchAsyncErrors(async (req,res,next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found",404));
  }
  product = await Product.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:false});
res.status(200).json({
  success:true,
  product,
});
});
exports.deleteProduct = catchAsyncErrors(async (req,res,next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found",404));
  }
  await Product.deleteOne({_id:req.params.id});
  res.status(200).json({
    success:true,
    message:"Product Deleted"
  });
});
