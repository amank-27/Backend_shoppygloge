import express from "express";
import mongoose from "mongoose";
import product from "./Products.js";
import Cart from "./Cart.js";
import { verifyToken } from "./verify.js"; // import the middleware to verify JWT tokens
import { register } from "./User.controller.js"; // import the user registration controller
import { login } from "./User.controller.js"; // import the user login controller

mongoose.connect("mongodb://localhost:27017/"); //connect to mongodb compass database
//all the code below is just to see if the connection is working or not
const db=mongoose.connection;
db.on("open", ()=>{
    console.log("connection successful");
});
db.on("error", ()=>{
    console.log("connection unsucessfull");
});

const app=new express();// initialize the Express app
//make a server
app.listen(4100, ()=>{
    console.log("server is running on port 4100");
});

app.use(express.json()); //to parse the incoming json

// middleware to log details of each request
app.use((req, res, next) => {
    const oldSend = res.send;
    res.send = function (body) {
        // log the details of the request
        console.log(`${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
        oldSend.apply(res, arguments);
    };
    next();
  });
  

app.post("/register", register); // User registration route
app.post("/login", login); // User login route

//using get and find to fetch data from mongodb compass database
app.get("/products" ,async(req, res)=>{
  console.log("data fetched from the users");
  const products= await product.find()//using find method to retrieve data
  res.status(200).send(products);
})
//using get and findById with object id to fetch specific product
app.get("/products/:id", async(req, res)=>{
   try{
    const particularProduct= await product.findById(req.params.id)  // Fetch the product by ID
    console.log("product with this particular id", particularProduct);
    if(particularProduct){
        return res.status(200).send(particularProduct);
    }else{
        return res.status(404).send({message:"product not found"})
    }
}catch(error){
   console.log("error retrieving product:", product);
   return res.status(500).send({message:"Internal server error"});
}
});
// using post and save method to add the product to the cart
app.post("/cart",verifyToken, async(req, res)=>{
   try{ 
    const {productId, quantity} = req.body; // extract productId and quantity from body
    if(!productId){
        console.log("product id is invalid");
    }else{
        console.log("new product added");
    }
    const particularProduct = await product.findById(productId);
   
    console.log(particularProduct)  // Log the fetched product
    if (!particularProduct) {
        return res.status(404).send({ message: "Product not found." });
    }
    const newCartItem=new Cart({
       productId:productId,
       quantity: quantity,
       name: particularProduct.name,
       category: particularProduct.category,
       price: particularProduct.price,
       
       description: particularProduct.description,

    });
    // Save the new cart item to the database
    const itemadded= await newCartItem.save();
 
    res.status(201).send({
    message:"cart item added sucessfully",
    cartItem: itemadded,
    });
}catch(error){
     console.log("error adding product",product);
     res.status(500).send({message:"internal server error"});
}
})
//using put and findById method to upadte the specific product in the cart
app.put("/cart/:id",verifyToken, async(req, res)=>{
   try{ const productId= req.params.id; // Extract product ID from URL
    console.log(`updating quantity of product with id: ${productId}`);
    const updatedProduct= await Cart.findById(productId);

    if(!updatedProduct){
        return res
        .status(404) 
        .json({message:"product with this id does not exist"});
    }
    const keys=Object.keys(req.body);  // Get the keys from the request body
    keys.forEach((key)=>{
        updatedProduct[key]= req.body[key];
        console.log(`quantity upgraded for product with ID: ${productId}`);
       });

    await updatedProduct.save(); // save the updated cart item
    res.status(200).send({ message: "product updated successfully", updatedProduct });
   }catch(error){
    console.log("error updating product");
     res.status(500).send({message:"internal server error"});
   }
})
//using delete , findById and deleteOne to fetch specific product in the cart to delete
app.delete("/cart/:id", async(req, res)=>{
    try {
    const productId= req.params.id;
    console.log(`deleting product with id:${productId}`);
    const deletedCartItem= await Cart.findById(productId);

    if(!deletedCartItem){
      return res
      .status(404)
      .send({message:"product with this id does not"})
    }
    
     await deletedCartItem.deleteOne(); // delete the cart item
     res.status(200).send({message:"cart item deleted successfully"});
    }catch(error){
        console.log("error deleting product");
        res.status(500).send({message:"internal server error"});
    }
})
