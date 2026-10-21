import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";


// 📝 Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
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
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log("Registration error: ", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// 🔓 Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check karein ki user ne email aur password dono bheje hain ya nahi
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. User ko email se find karein aur password ko explicitly select karein
        const existUser = await User.findOne({ email }).select("+password");
        
        if (!existUser) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 3. ✅ FIX: Direct bcryptuse karke password match karein
        const isPasswordCorrect = await bcrypt.compare(password, existUser.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 4. ✅ FIX: Aapke upar banaye gaye generateToken function ka use karein
        const token = generateToken(existUser._id);

        // 5. Successful Response bhejein
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: existUser._id,
                name: existUser.name,
                email: existUser.email
            },
            token
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// 👤 Logged in user profile api 
const getProfile = async (req, res) => {

    try {
        const findUser = await User.find()  
        return res.status(200).json({
            message: findUser
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export { registerUser, login, getProfile };
