
import generateToken from "../utils/generateToken.js";
import Captain from "../models/captain.model.js";
import bcrypt from "bcryptjs";

// ================= REGISTER CAPTAIN =================
const registerCaptain = async (req, res) => {
    try {
        const {
            fullname,
            email,
            password,
            status,
            vehicle,
            plate,
            capacity,
            vehicleType
        } = req.body;

        // 1. Validate required fields
        if (
            !fullname ||
            typeof fullname.firstname !== "string" ||
            !fullname.firstname.trim() ||
            (fullname.lastname != null &&
                typeof fullname.lastname !== "string") ||
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            !password ||
            !vehicle ||
            typeof vehicle.color !== "string" ||
            !vehicle.color.trim() ||
            typeof plate !== "string" ||
            !plate.trim() ||
            capacity === undefined ||
            capacity === null ||
            capacity === "" ||
            !Number.isFinite(Number(capacity)) ||
            Number(capacity) <= 0 ||
            typeof vehicleType !== "string" ||
            !vehicleType.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields with valid values"
            });
        }

        // 2. Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // 3. Normalize input values
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPlate = plate.trim().toUpperCase();
        const normalizedVehicleType = vehicleType.trim().toLowerCase();

        // 4. Validate vehicle type
        const allowedVehicleTypes = ["car", "motorcycle", "auto"];

        if (!allowedVehicleTypes.includes(normalizedVehicleType)) {
            return res.status(400).json({
                success: false,
                message: "Vehicle type must be car, motorcycle, or auto"
            });
        }

        // 5. Check existing email or vehicle plate
        const existingCaptain = await Captain.findOne({
            $or: [
                { email: normalizedEmail },
                { plate: normalizedPlate }
            ]
        });

        if (existingCaptain) {
            return res.status(409).json({
                success: false,
                message: "A captain with this email or vehicle plate already exists"
            });
        }

        // 6. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 7. Create captain
        const newCaptain = await Captain.create({
            fullname: {
                firstname: fullname.firstname.trim(),
                lastname: fullname.lastname?.trim() || ""
            },
            email: normalizedEmail,
            password: hashedPassword,
            status: status || "inactive",
            vehicle: {
                color: vehicle.color.trim()
            },
            plate: normalizedPlate,
            capacity: Number(capacity),
            vehicleType: normalizedVehicleType
        });

        // 8. Generate token using the new captain's ID
        const token = generateToken(newCaptain._id);

        // 9. Send response without password
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            captain: {
                id: newCaptain._id,
                fullname: newCaptain.fullname,
                email: newCaptain.email,
                status: newCaptain.status,
                vehicle: newCaptain.vehicle,
                plate: newCaptain.plate,
                capacity: newCaptain.capacity,
                vehicleType: newCaptain.vehicleType
            }
        });

    } catch (error) {
        console.error("Error in registerCaptain:", error);

        // Handle MongoDB duplicate-key errors
        if (error.code === 11000) {
            const duplicateField = Object.keys(
                error.keyPattern || {}
            )[0];

            return res.status(409).json({
                success: false,
                message: `Duplicate value for ${duplicateField || "a unique field"}. Please use a different value.`,
                field: duplicateField || "unknown"
            });
        }

        // Handle Mongoose schema validation errors
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ================= LOGIN CAPTAIN =================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 2. Find captain and include password
        const captain = await Captain.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!captain) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(
            password,
            captain.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 4. Generate token
        const token = generateToken(captain._id);

        // 5. Send response without password
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            captain: {
                id: captain._id,
                fullname: captain.fullname,
                email: captain.email,
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


//  profile api

const getCaptainProfile = async (req,res) =>{
  try{
    const captain =  await Captain.find();
     if(!captain){
        return res.status(404).json({
            success: false,
            message: "Captain not found"
        });

     }
     return res.status(200).json({
        success: true,
        captain
     })
  }
  catch(error){
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    })
  }
}

//  update api 

const updateCaptain = async (req, res) => {
    try {
        const captain = await Captain.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        if (!captain) {
            return res.status(404).json({
                success: false,
                message: "Captain not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Captain updated successfully",
            captain
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= EXPORTS =================

export { login, registerCaptain, getCaptainProfile, updateCaptain  };
