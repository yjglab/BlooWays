const passport = require("passport");
const local = require("./local");
const Blooway = require("../models/blooway");
const User = require("../models/user");
const kakao = require("./kakaoStrategy");
const google = require("./googleStrategy");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: ["id", "email", "username"],
        include: [
          {
            model: Blooway,
            as: "Blooways",
          },
        ],
      });
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  });
  local();
  kakao(passport);
  google();
};
