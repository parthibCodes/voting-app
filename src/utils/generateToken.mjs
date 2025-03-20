import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateJWT = (userData)=>{
    if(!userData){
        throw new Error("userData must be provided");
    }
    return jwt.sign(userData,process.env.JWT_SECRET_KEY);
}

export const jwtAuthMiddleWare = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ error: "Token is not found" });
    }

    const token = authorization.split(' ')[1];  // Get token from the "Bearer token"
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  // Verify and decode the token
        console.log("JWT Middleware Passed - Decoded User:", decoded);  // Log the decoded user to confirm
        req.user = decoded;  // Attach the decoded user to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        return res.status(403).json({ error: "Invalid or expired token" });  // Handle invalid token
    }
};


