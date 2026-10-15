import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//  jwt token create karne ki liye function 

 const generateToken = (userId) => {
    return jwt.sign({
        id: userId
    },
    process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
}


// Register user

const registerUser = async (req, res) => {
    try{

  
    const  {name,email,password} = req.body;

    // Validation
    if(!name || !email || !password){
        return res.status(400).json({message: "Please fill all the fields"});
    }
    const userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({message: "User already exists"});
    }
    if(password.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters long"});
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
    // Generate token
    const token = generateToken(user._id);
      return res.status(201).json({
        message: "Registration sucessful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
      }

    catch(error){
      console.log("Login error ", error.message)
      res.status(500).json({
        message: "Internal server error "
      })
}
}
export default registerUser
       