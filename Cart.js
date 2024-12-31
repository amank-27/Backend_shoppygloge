import mongoose from 'mongoose';


const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
 
  quantity: {
    type: Number,
    required: true,
    min: 1,  
  },
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
   
   description:{
    type:String,
    required: true,
   }
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
