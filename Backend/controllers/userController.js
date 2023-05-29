const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
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

exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findOne({email:req.body.email});
  if (!user) {
    return next(new ErrorHandler("User not found",404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({validateBeforeSave:false});
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;
  try {
  await sendEmail({
    email:user.email,
    subject:`Kharido Password Recovery`,
    message,
  });
  res.status(200).json({
    success:true,
    message:`Email sent to ${user.email} successfully`,
  });
  } catch(error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave:false});
    return next(new ErrorHandler(error.message,500));
  }
});

exports.resetPassword = catchAsyncErrors(async(req,res,next)=> {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()},
  });
  if (!user) {
    return next(new ErrorHandler("Reset Password Token is invalid or has been expired",400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match",400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user,200,res);
});

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=> {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success:true,
    user,
  });
});

exports.updatePassword = catchAsyncErrors(async(req,res,next)=> {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect",400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not match",400));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user,200,res);
});
exports.updateProfile = catchAsyncErrors(async(req,res,next)=> {
  const newUserData = {
    name:req.body.name,
    email:req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
  });
  res.status(200).json({
    success:true,
  });
});
exports.getAllUser = catchAsyncErrors(async(req,res,next)=> {
  const users = await User.find();
  res.status(200).json({
    success:true,
    users,
  });
});
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=> {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id : ${req.params.id}`));
  }
  res.status(200).json({
    success:true,
    user,
  });
});
