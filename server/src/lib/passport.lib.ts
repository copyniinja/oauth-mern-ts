import dotenv from "dotenv";
import { Types } from "mongoose";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "../config";
import User, { IUser } from "../models/user.model";
import { createUser, getUserByEmail } from "../services/user.service";
import { compareHashString } from "./bcrypt.lib";
import logger from "./winston.lib";
dotenv.config();

// Local strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // Check it user exists with given email
    const user = await getUserByEmail(email);
    if (!user) {
      return done(null, false, { message: "No user found" });
    }
    // Check if the user has "credential" in providers
    const hasCredential = user?.providers.some((p) => p.type === "credentials");
    if (!hasCredential || !user?.password) {
      return done(null, false, { message: "Registered with Oauth only" });
    }
    // Compare user password
    const isValid = await compareHashString(password, user?.password!);
    if (!isValid) {
      return done(null, false, { message: "Wrong credentials" });
    }
    const { password: _, ...userWithOutPass } = user;
    return done(null, userWithOutPass);
  })
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      // Check email is provided by google
      const email = profile.emails?.[0].value;
      if (!email) {
        return done(null, false, {
          message: "Email is not provided by google",
        });
      }

      try {
        // Find user by email
        const user = await User.findOne({ email });

        // If user exists add google in providers if not included
        if (user) {
          const hasGoogleInProviders = user.providers.some(
            (p) => p.type === "google"
          );
          if (!hasGoogleInProviders) {
            user.providers.push({ type: "google", providerId: profile.id });
            await user.save();
          }
          // Remove password
          const { password: _, ...userWithOutPass } = user.toObject();
          return done(null, userWithOutPass);
        }
        // Create new User
        // Check if the user email is included in admin list
        let isAdmin = false;
        if (config.ADMIN_LIST.includes(email)) {
          isAdmin = true;
        }
        const newUser: IUser & { _id: Types.ObjectId } = await createUser({
          email,
          name: profile.displayName,
          role: isAdmin ? "ADMIN" : "CUSTOMER",
          providers: [{ type: "google", providerId: profile.id }],
          profileImage: profile.photos?.[0].value || "",
        });
        done(null, newUser);
      } catch (error) {
        logger.error(error);
        done(error);
      }
    }
  )
);

export default passport;
