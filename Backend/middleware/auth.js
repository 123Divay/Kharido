const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
  const {token} = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to acces the resource",401));
  }
  const decodeData = jwt.verify(token,process.env.JWT_SECRET);
  
});
