import express from "express";
import {registerUser, login, getProfile} from "../controllers/userController.js";


const router = express.Router();

router.post("/register", registerUser)
router.post("/login", login)
router.get("/getProfile", getProfile)



export default router; 






 
