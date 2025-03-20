import express from "express";
import userRoute from "./routes/userRoutes.mjs";
import candidateRoute from "./routes/candidateRoutes.mjs"
import "./config/db.mjs";
import { generateJWT ,jwtAuthMiddleWare } from "./utils/generateToken.mjs"

const app = express();

import dotenv from "dotenv";
dotenv.config();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use("/api/users",userRoute);
app.use("/api/candidates",candidateRoute);

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});