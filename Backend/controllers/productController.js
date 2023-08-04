const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});
exports.getAllProducts = catchAsyncErrors(async (req,res) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter();

  let products = await apiFeatures.query ;

  let filteredProductsCount = products.length;

  apiFeatures.pagination(resultPerPage);

 products= await apiFeatures.query.clone();
  
  res.status(200).json({
    success:true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

exports.getAdminProducts = catchAsyncErrors(async (req,res) => {
  const products = await Product.find();
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

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
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

// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await Product.deleteOne({_id:req.params.id});

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});
exports.createProductReview = catchAsyncErrors(async(req,res,next)=> {
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
exports.getProductReviews = catchAsyncErrors(async(req,res,next)=> {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found",404));
  }
  res.status(200).json({
    success:true,
    reviews:product.reviews,
  });
});
exports.deleteReview = catchAsyncErrors(async(req,res,next)=> {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found",404));
  }
  const reviews = product.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString());
  console.log(reviews);
  let avg=0;
  reviews.forEach((rev)=>{
    avg=avg+rev.rating;
  });
  console.log(avg);
  const ratings=avg/reviews.length;
  console.log(ratings);
  const numofreviews = reviews.length;
  console.log(numofreviews);
  await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numofreviews,
  },
  {
    new:true,
  }
);
  res.status(200).json({
    success:true,
  });
});