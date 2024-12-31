import mongoose from "mongoose";

// define the schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});



const User = mongoose.model("User", userSchema);

export default User;
