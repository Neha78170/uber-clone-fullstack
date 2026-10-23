import mongoose from "mongoose";

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: { // Fixed typo from fristname
            type: String,
            required: true, // Fixed spelling
            trim: true,
            minlength: 2,
        },
        lastname: {
            type: String,
            trim: true,
            default: ""
        }
    },
    email: {
        type: String,
        required: true, // Fixed spelling
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
    },
    vehicle: {
        color: {
            type: String,
            required: true, // Fixed spelling
        }
    },
    plate: {
        type: String,
        required: true, // Fixed spelling of required and true
        unique: true,
        uppercase: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true, // Fixed spelling
  
        // Removed uppercase and trim because capacity is a Number
    },
    vehicleType: {
        type: String,
        required: true, // Recommended to make this required
        enum: ["car", "motorcycle", "auto"] // Fixed spelling of motorcycle
    }
}, {
    timestamps: true
});

const Captain = mongoose.model("Captain", captainSchema);
export default Captain;
