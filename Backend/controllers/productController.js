const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
exports.createProduct = catchAsyncErrors(async (req,res,next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success:true,
    product,
  });
});
exports.getAllProducts = catchAsyncErrors(async (req,res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
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
      productCount,
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
exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{
  const {rating,comment,productId} = req.body;
  const review = {
    user:req.body._id,
    name:req.body.name,
    rating:Number(rating),
    comment,
  }
  const product = await Product.findById(productId);
    product.reviews.push(review);
    product.numofreviews = product.reviews.length;
  let avg=0;
  product.reviews.forEach((rev)=>{
    avg=avg+rev.rating;
  });
  product.ratings=avg/product.reviews.length;
  await product.save({validateBeforeSave:false});
  res.status(200).json({
    success:true,
  });
});
