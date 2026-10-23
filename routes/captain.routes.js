
import express from "express";
import {registerCaptain, 
    login,getCaptainProfile,
    updateCaptain
} from "../controllers/captain.controller.js";

const router = express.Router();

router.post("/register", registerCaptain);
router.post("/login", login);
router.get("/profile", getCaptainProfile);
router.patch("/update:id", updateCaptain);


export default router;
