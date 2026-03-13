import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  
  return jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};