import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    age:{
        type: Number,
        required:true
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:"voter"
    },
    isVoted:{
        type:Boolean,
        default:false
    }
});

userSchema.pre('save',async function(next){
    const user = this;
    if(!user.isModified("password"))return next();
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password,salt);
        user.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
};

const User = mongoose.model("User",userSchema);
export {User};