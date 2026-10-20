import Captain from "../models/captain.model.js";
import bcrypt from "bcryptjs";

const registerCaptain = async (req, res) => {
    try {
        const { fullname, email, password, status, vehicle, vehicleType } = req.body;

        // 1. Validation: Check if any required field is missing
        if (
            !fullname?.firstname?.trim() || 
            !fullname?.lastname?.trim() || 
            !email?.trim() || 
            !password || 
            !vehicle?.color?.trim() || 
            !vehicle?.plate?.trim() || 
            !vehicle?.capacity || 
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

        // 3. Normalize inputs for consistency
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPlate = vehicle.plate.trim().toUpperCase();

        // 4. Check for existing captain (by email OR license plate)
        const existingCaptain = await Captain.findOne({
            $or: [
                { email: normalizedEmail },
                { "plate": normalizedPlate } // Matches 'plate' from your previous schema structure
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

        // 6. Create and save the new captain
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
            capacity: vehicle.capacity,
            vehicleType: vehicleType.trim()
        });

        // 7. Remove sensitive fields from the final response object
        const captainResponse = newCaptain.toObject();
        delete captainResponse.password;

        return res.status(201).json({
            success: true,
            message: "Captain registered successfully",
            data: captainResponse
        });

    } catch (error) {
        console.error("Error in registerCaptain:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default registerCaptain;
