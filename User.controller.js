import User from "./User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export async function register(req, res) {
    const { username, password } = req.body;
 try {
 // Check if the user already exists
 const existingUser = await User.findOne({ username });
    if (existingUser) {
     return res.status(400).json({ message: "User already exists" });
 }
 // Hash the password
     const hashedPassword = await bcrypt.hash(password, 10);
// Create a new user
 const newUser = new User({
    username,
    password: hashedPassword,
     });
 // Save the user
 await newUser.save();
 return res.status(201).json({ message: "User registered successfully" });
} catch (error) {
     res.status(500).json({ message: "Internal server error" });
    }
}

// Login a user
export async function login(req, res) {
    const { username, password } = req.body;
try {
 // Find the user by username
 const user = await User.findOne({ username });
 if (!user) {
     return res.status(404).json({ message: "User not found" });
     }
 // Compare the provided password with the stored hash
 const isMatch = await bcrypt.compare(password, user.password);
 if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }
// Generate a JWT token
 const token = jwt.sign({ userId: user._id }, "secretKey", {
     expiresIn: "1h", // Token expires in 1 hour
    });
  res.status(200).json({ message: "Login successful", token });
 } catch (error) {
     res.status(500).json({ message: "Internal server error" });
    }
}
