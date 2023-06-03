const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");

const { User, Blooway, Area } = require("../models");
dotenv.config();

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "/api/auth/google/callback",
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existedUser = await User.findOne({
            where: { social: "google", socialId: profile.id },
          });
          if (existedUser) {
            done(null, existedUser);
          } else {
            const newSocialUser = await User.create({
              email: profile.emails[0].value,
              username: `google_${Math.random().toString(36).slice(7)}`,
              password: "social",
              social: "google",
              socialId: profile.id,
            });
            const baseBlooway = await Blooway.create({
              name: newSocialUser.username,
              link: newSocialUser.username,
              BuilderId: newSocialUser.id,
            });
            const baseArea = await Area.create({
              name: "전체",
              secret: false,
              BloowayId: baseBlooway.id,
            });
            await baseBlooway.addMembers(newSocialUser);
            await baseArea.addMembers(newSocialUser);
            done(null, newSocialUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
