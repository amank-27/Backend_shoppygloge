import jwt from "jsonwebtoken";

  // Middleware to verify JWT token
 export function verifyToken(req, res, next) {
    // Checking if the Authorization header exists and starts with 'JWT'
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith("JWT ")) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }
// Extract the token from the Authorization header
const token = authHeader.split(" ")[1];
// Verify the token
    jwt.verify(token, "secretKey", (err, verifiedToken) => {
        if (err) {
            return res.status(403).json({ message: "Invalid JWT token" });
        }
req.user = verifiedToken; //store user data in `req.user`

        // Call the next middleware
        next();
    });
}

