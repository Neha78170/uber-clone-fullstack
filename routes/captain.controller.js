import express from express;
import registerCaptain from "../controllers/captain.controller";

const router = express.Router();

router.post("/register", registerCaptain);

export default router;