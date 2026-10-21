import generateToken from "../utils/generateToken.js";
import Captain from "../models/captain.model.js";
import bcrypt from "bcryptjs";

const registerCaptain = async (req, res) => {
    try {
        const { fullname, email, password, status, vehicle, plate, capacity, vehicleType } = req.body;

        // 1. Validation: ब्रैकेट () के साथ सही तरीक़ा
        if (
            !fullname?.firstname?.trim() || 
            !fullname?.lastname?.trim() || 
            !email?.trim() || 
            !password || 
            !vehicle?.color?.trim() || 
            !plate?.trim() || 
            !capacity || 
            !vehicleType?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // 2. Password length validation 
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        } 

        // 3. Normalize inputs (यहाँ vehicle.plate हटाकर सीधे plate.trim() किया है)
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPlate = plate.trim().toUpperCase();

        // 4. Check for existing captain
        const existingCaptain = await Captain.findOne({
            $or: [
                { email: normalizedEmail },
                { "plate": normalizedPlate }
            ]
        }); 

        if (existingCaptain) {
            return res.status(409).json({
                success: false,
                message: "A captain with this email or vehicle plate already exists"
            });
        }

        // 5. Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 6. Create and save the new captain (यहाँ भी vehicle.capacity हटाकर सीधे capacity लिखा है)
        const newCaptain = await Captain.create({
            fullname: {
                firstname: fullname.firstname.trim(),
                lastname: fullname.lastname.trim()
            },
            email: normalizedEmail,
            password: hashedPassword,
            status: status || "inactive",
            vehicle: {
                color: vehicle.color.trim()
            },
            plate: normalizedPlate,
            capacity: capacity, // Fixed here
            vehicleType: vehicleType.trim()
        });
        const token = generateToken(User.id);
         return res.status(201).json({
            message: "Registration successful",
            token,
            user: newCaptain
         })

    
    } catch (error) {
      
        console.error("Error in registerCaptain:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const login = async (req, res) =>{
    const {email, password} = req.body;
    try{
    if(!email || !password){
       res.status(404).json({
        success: false,
        message: "Email and password are requried"
       })

    }
    const captain = await Captain.findOne({
        email: email.trim().toLowerCase()
    }).select("+password");
    if(!captain){
        return res.status(401).json({
            sucess: false,
            message: "Invaild email or password"
        });
    }
    const isMatch = await bcrypt.compare(
        password,
        captain.password
    );
    if(!isMatch){
       return res.status(401).json({
        success: false,
         message: "Invalid email or password"
       })
    }
     return res.status(201).json({
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
    
 
}

export default registerCaptain;
