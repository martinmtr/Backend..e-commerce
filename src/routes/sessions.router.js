import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import { UserModel } from "../models/user.model.js";
import { createHash } from "../utils/bcrypt.js";
import UserDTO from '../dto/user.dto.js'; 
import { validateUser } from "../middlewares/validators/user.validator.js";
const router = Router();

router.post("/register", validateUser, async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const newUser = await UserModel.create({
      first_name, last_name, email, age,
      password: createHash(password)
    });

    res.status(201).json({ status: "success", user: { id: newUser._id, email: newUser.email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role
    });

    res.json({
      status: "success",
      token
    });
  }
);

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    
    const userDto = new UserDTO(req.user);
    
    res.json({
      status: "success",
      payload: userDto 
    });
  }
);

export default router;