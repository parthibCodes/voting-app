import {User} from "../models/user.mjs";
import { asyncHandler } from "../middlewares/asyncHandler.mjs";
import {generateJWT,jwtAuthMiddleWare} from "../utils/generateToken.mjs";
const registerUser = asyncHandler(async (req,res,next)=>{
    const data = req.body;
    const existingAdminCount = await User.countDocuments({ role: "admin" });
    if(data.role === "admin" && existingAdminCount > 0){
        return res.status(409).json({ message: "Only one admin is allowed" });
    }
    const newUser = new User(data);
    const response = await newUser.save();
    console.log("Data is saved");
    const payLoad = {
        id:response.id
    }
    
    console.log(JSON.stringify(payLoad));
    const token = generateJWT(payLoad);
    console.log("Token is: ",token);
    res.status(200).json({response:response,token:token});
});

const loginUser = asyncHandler(async(req,res,next)=>{
    const {aadharCardNumber,password} = req.body;

    const user = await User.findOne({aadharCardNumber:aadharCardNumber});
    if(!user){
        return res.status(401).json({error:"Invalid aadharCardNumber"});
    }
    if(!(await user.comparePassword(password))){
        return res.status(401).json({error:"Invalid password"});
    }
    const payLoad = {
        id:user.id
    }
    const token = generateJWT(payLoad);
    res.json({token});
});

const profileData = asyncHandler(async(req,res,next)=>{
    const userData = req.user;
    const userId = userData.id;
    const user = userData.findOne(userId);
    res.status(200).json({user});
});

const modifyPassword = asyncHandler(async(req,res,next)=>{
    const userId = req.user.id;
    const {currentPassword,newPassword} = req.body;
    const user = await User.findById(userId);
    if(!(await user.comparePassword(currentPassword))){
        return res.status(401).json({error:"Invalid password"});
    }
    user.password = newPassword;
    await user.save();
    console.log("password updated");
    res.status(200).json({message:"Password updated"});
});

export  {registerUser,loginUser,profileData,modifyPassword};