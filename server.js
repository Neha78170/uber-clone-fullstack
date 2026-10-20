import express from "express";
import cors from "cors";
import authRoutes from "./routes/userRoutes.js"
import  connectDB from "./config/db.js";
import registerCaptain from "./controllers/captain.controller.js";


const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/captains", registerCaptain);

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
    const authorization = req.headers.authorization;
    console.log(authorization, "error");
 
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
 
});