import mongoose from "mongoose";

// define the schema for the product model
const productSchema= mongoose.Schema({
   name:{
    type:String,
    required:true,
   },
   category:{
    type: String,
   required: true,
   },
   price:{
    type:Number,
    required:true,
   },
   stock_quantity:{
    type:Number,
    required:true,
   },
   description:{
    type:String,
    required: true,
   }
});

const product= mongoose.model("Product", productSchema);

export default product;