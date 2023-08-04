const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Please Enter the Product Name"],
    trim:true
  },
  description:{
    type:String,
    required:[true,"Please Enter the Product Description"]
  },
  price:{
    type:Number,
    required:[true,"Please Enter the Product Price"],
    maxlength:[8,"Price cannot exceed 8 Characters"]
  },
  ratings:{
    type:Number,
    default:0
  },
  images:[
    {
      public_id:{
        type:String,
        required:true
      },
      url:{
        type:String,
        required:true
      }
    }
  ],
  category:{
    type:String,
    required:[true,"Please Enter the Product Category"],

  },
  stock:{
    type:Number,
    required:[true,"Please Enter the Product Stock"],
    maxlength:[3,"Stock cannot exceed 3 Characters"],
    default:1
  },
  numofreviews:{
    type:Number,
    default:0
  },
  reviews:[
    {
      user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
      },
      name:{
        type:String,
        required:true
      },
      rating:{
        type:Number,
        required:true,
      },

      comment:{
        type:String,
        required:true
      }
    }
  ],
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true,
  },
  createdat:{
    type:Date,
    default:Date.now
  }
})
module.exports = mongoose.model("Product",productSchema);
