import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name must be at most 50 characters long"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;
