import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURL = process.env.mongo_URL;

if(!mongoURL){
    console.error("MongoDB URI is not defined in environment variables.");
    process.exit(1);
}

mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("MongoDB connected successfully")
}).catch((error)=>{
    console.log("Error connecting to MongoDB:",error);
});

export default mongoose;
