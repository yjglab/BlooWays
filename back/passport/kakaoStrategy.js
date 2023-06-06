const KakaoStrategy = require("passport-kakao").Strategy;
const dotenv = require("dotenv");
const { User, Blooway, Area } = require("../models");
dotenv.config();

module.exports = (passport) => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: "/api/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existedUser = await User.findOne({
            where: {
              social: "kakao",
              socialId: profile.id,
            },
          });
          if (existedUser) {
            done(null, existedUser);
          } else {
            const newSocialUser = await User.create({
              email: profile._json.kakao_account.email,
              username: `kakao_${Math.random().toString(36).slice(7)}`,
              password: "social",
              social: "kakao",
              socialId: profile.id,
            });
            // 기본 블루웨이 생성
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
            // 전체 블루웨이에 추가
            const allMembersBlooway = await Blooway.findOne({
              where: {
                id: 1,
                link: "all",
              },
            });
            const allMembersArea = await Area.findOne({
              where: {
                id: 1,
              },
            });
            await allMembersBlooway.addMembers(newSocialUser);
            await allMembersArea.addMembers(newSocialUser);

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
