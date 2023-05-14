const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken")

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
  const {name,email,password} = req.body;
  const user = await User.create({
    name,email,password,
    avatar:{
      public_id:"this is a sample id",
      url:"sampleurl"
    }
  });
  sendToken(user,201,res);
});

exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
  const {email,password} = req.body;
  if (!email||!password) {
    return next (new ErrorHandler("Please enter email and password",400));
  }
  const user = await User.findOne({email}).select("+password");
  if (!user) {
    return next(new ErrorHandler("Please enter valid email or password",401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Please enter valid email or password",401));
  }
  sendToken(user,200,res);
});

exports.logoutUser = catchAsyncErrors(async(req,res,next)=>{
res.cookie("token",null,{
  expires:new Date(Date.now()),
  httpOnly:true,
});

  res.status(200).json({
    success:true,
    message:"Logged out",
  });
});
