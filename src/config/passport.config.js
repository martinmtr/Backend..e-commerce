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
      try {
        const user = await UserModel.findById(jwt_payload.user._id);
        if (!user) return done(null, false);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
};