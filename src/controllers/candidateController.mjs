import Candidate from "../models/candidates.mjs";
import { User } from "../models/user.mjs";
import { asyncHandler } from "../middlewares/asyncHandler.mjs";
import {generateJWT,jwtAuthMiddleWare} from "../utils/generateToken.mjs";
import router from "../routes/userRoutes.mjs";

const checkAdminRole = asyncHandler(async(userId)=>{
    const user = await User.findById(userId);
    return user.role === "admin";
});

export const registerCandidate = asyncHandler(async(req,res,next)=>{
    if(!await checkAdminRole(req.user.id)){
        return res.status(404).json({message:"User has not admin role"});
    }
    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    console.log("data is saved");
    res.status(200).json({response:response});
});

export const updateCandidate = asyncHandler(async(req,res,next)=>{
    if(!await checkAdminRole(req.user.id)){
        return res.status(403).json({message:"User has no admin role"});
    }
    const candidateId = req.params.id;
    const updatedCandidateData = req.body;
    const response = await Candidate.findByIdAndUpdate(candidateId,updatedCandidateData,{
        new:true,
        runValidators:true
    });
    if(!response){
        res.status(404).json({error:"Candidate not found"});
    }
    console.log("candidate data updated");
    res.status(200).json(response);
});


export const deleteCandidate = asyncHandler(async(req,res,next)=>{
    if(!await checkAdminRole(req.user.id)){
        return res.status(403).json({message:"User has not admin role"});
    }
    const candidateId = req.params.candidateId;
    const response = await Candidate.findByIdAndDelete(candidateId);
    if(!response){
        res.status(404).json({error:"Candidate not found"});
    }
    console.log("candidate data deleted");
    res.status(200).json(response);
});

export const voteCandidate = asyncHandler(async(req,res,next)=>{
    const candidateId = req.params.candidateId;
    const userId = req.user.id;
    const candidate = await Candidate.findById(candidateId);
    if(!candidate){
        return res.status(404).json({error:"Candidate not found"});
    }
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({error:"User not found"});
    }
    if(user.isVoted){
        return res.status(400).json({message:"User has already voted"});
    }
    if(user.role === "admin"){
        return res.status(403).json({message:"Admin is not allowed"});
    }
    candidate.votes.push({user:userId});
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();
    res.status(200).json({message:"Vote recorded successfully"});
});

export const countVoteCandidate = asyncHandler(async(req,res,next)=>{
    const candidate = await Candidate.find().sort({voteCount:"desc"});
    const voteRecord = candidate.map((data)=>{
        return {
            party : data.party,
            count : data.voteCount
        }
    });
    return res.status(200).json(voteRecord);
});

export const getCandidateList = asyncHandler(async (req, res, next) => {
    const candidates = await Candidate.find();

    // Utility function to convert ObjectId fields to string
    const convertObjectIdsToString = (data) => {
        return data.map(candidate => {
            return {
                ...candidate.toObject(), // Convert the mongoose document to a plain object
                _id: candidate._id.toString(),
                votes: candidate.votes.map(vote => ({
                    ...vote.toObject(),
                    user: vote.user.toString(), // Convert user ObjectId to string
                    _id: vote._id.toString()    // Convert vote _id to string
                }))
            };
        });
    };

    // Convert ObjectId fields to string
    const formattedCandidates = convertObjectIdsToString(candidates);

    return res.status(200).json(formattedCandidates);  // Return the formatted candidates
});
