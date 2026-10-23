import express from "express";
import cors from "cors";
import authRoutes from "./routes/userRoutes.js"
import  connectDB from "./config/db.js";
import captainRoutes from "./routes/captain.routes.js";


const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/captains", captainRoutes);

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