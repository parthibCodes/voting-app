import express from "express";
import { registerUser,loginUser,profileData,modifyPassword } from "../controllers/userController.mjs";

const router = express.Router();
//Register route
router.post('/signup',registerUser);
//Login Route
router.post('/login',loginUser);
//User profile
router.get('/profile',profileData);
//Modify password
router.put('/profile/password',modifyPassword);

export default router;