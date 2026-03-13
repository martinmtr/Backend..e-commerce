import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";

import { UserModel } from "../models/user.model.js";
import { isValidPassword } from "../utils/bcrypt.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializePassport = () => {


  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) return done(null, false);

          if (!isValidPassword(user, password))
            return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

passport.use(
  "current",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET 
    },
    async (jwt_payload, done) => {
      console.log("SECRET USADO PARA VERIFICAR:", process.env.JWT_SECRET);
      try {
        console.log("Contenido del Payload:", jwt_payload);

        const userId = jwt_payload.user ? jwt_payload.user._id : jwt_payload._id;

        if (!userId) {
          console.log("No se encontró un ID de usuario en el token");
          return done(null, false);
        }

        const user = await UserModel.findById(userId);
        
        if (!user) {
          console.log("Usuario no encontrado en la base de datos");
          return done(null, false);
        }

        console.log("¡Usuario autenticado correctamente:", user.email);
        return done(null, user);
      } catch (error) {
        console.error("Error en JWT Strategy:", error);
        return done(error);
      }
    }
  )
);
};