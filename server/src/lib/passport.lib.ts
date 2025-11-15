import dotenv from "dotenv";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmail } from "../services/user.service";
import { compareHashString } from "./bcrypt.lib";
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

export default passport;
