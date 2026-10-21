import jwt from "jsonwebtoken";


const generateToken = (id, role) =>{
  return jwt.sign({
    id: id.toString(),
    role,
  },
  process.env.JWT_SECRET,
  {
     expiresIn: process.env.JWT_SECRET || "1d",
  }
)
}
export default generateToken;