const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const multer = require("multer");
const User = require("../models/user");
const Blooway = require("../models/blooway");
const Area = require("../models/area");
const AreaTalk = require("../models/areaTalk");
const Private = require("../models/private");
const path = require("path");
const fs = require("fs");

const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { isNotSignIn, isSignIn } = require("./middlewares");

// 모든 블루웨이 로드
router.get("/blooways", isSignIn, async (req, res, next) => {
  try {
    const blooways = await Blooway.findAll({
      include: [
        {
          model: User,
          as: "Members",
          attributes: ["id"],
          through: {
            where: { UserId: req.user.id },
            attributes: ["UserId"],
          },
        },
      ],
    });
    return res.json(blooways);
  } catch (error) {
    next(error);
  }
});

// 블루웨이 추가
router.post("/blooways", isSignIn, async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const alreadyExisted = await Blooway.findOne({
      where: { link: req.body.link },
    });
    if (alreadyExisted) {
      await transaction.rollback();
      return res.status(404).send("이미 사용중인 블루웨이 링크입니다.");
    }
    const blooway = await Blooway.create(
      {
        name: req.body.blooway,
        link: req.body.link,
        BuilderId: req.user.id,
      },
      {
        transaction,
      }
    );
    await blooway.addMembers(req.user.id, { transaction });
    const area = await Area.create(
      {
        name: "전체",
        BloowayId: blooway.id,
      },
      {
        transaction,
      }
    );
    await area.addMembers(req.user.id, { transaction });
    await transaction.commit();
    return res.json(blooway);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

// 특정 블루웨이의 모든 에리어 로드
router.get("/blooways/:blooway/areas", isSignIn, async (req, res, next) => {
  try {
    const blooway = await Blooway.findOne({
      where: { link: req.params.blooway },
    });
    if (!blooway) {
      return res.status(404).send("존재하지 않는 블루웨이입니다.");
    }
    return res.json(
      await blooway.getAreas({
        include: [
          {
            model: User,
            as: "Members",
            attributes: ["id"],
            through: {
              where: {
                UserId: req.user.id,
              },
              attributes: ["UserId"],
            },
            required: true,
          },
        ],
      })
    );
  } catch (error) {
    next(error);
  }
});

// 특정 블루웨이에 에리어 추가
router.post("/blooways/:blooway/areas", isSignIn, async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const blooway = await Blooway.findOne({
      where: { link: req.params.blooway },
      include: [
        {
          model: Area,
          attributes: ["name"],
        },
      ],
    });
    if (!blooway) {
      await transaction.rollback();
      return res.status(404).send("존재하지 않는 블루웨이입니다.");
    }
    if (blooway.Areas.find((v) => v.name === req.body.name)) {
      await transaction.rollback();
      return res.status(404).send("이미 존재하는 에리어 네임입니다.");
    }
    const area = await Area.create(
      {
        name: req.body.name,
        BloowayId: blooway.id,
      },
      {
        transaction,
      }
    );
    await area.addMembers(req.user.id, { transaction });
    await transaction.commit();
    return res.json(area);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

// 특정 블루웨이의 특정 에리어 로드
router.get(
  "/blooways/:blooway/areas/:area",
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
        include: [
          {
            model: Area,
          },
        ],
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      const area = blooway.Areas.find(
        (v) => v.name === decodeURIComponent(req.params.area)
      );
      if (!area) {
        return res.status(404).send("존재하지 않는 에리어입니다.");
      }
      return res.json(area);
    } catch (error) {
      next(error);
    }
  }
);

// 특정 블루웨이의 특정 에리어의 모든 대화내용 로드
router.get(
  "/blooways/:blooway/areas/:area/talks",
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
        include: [
          {
            model: Area,
          },
        ],
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      const area = blooway.Areas.find(
        (v) => v.name === decodeURIComponent(req.params.area)
      );
      if (!area) {
        return res.status(404).send("존재하지 않는 에리어입니다.");
      }
      return res.json(
        await area.getTalks({
          include: [
            {
              model: User,
              attributes: ["id", "username", "email"],
            },
            {
              model: Area,
            },
          ],
          order: [["createdAt", "DESC"]],
          limit: parseInt(req.query.perPage, 10),
          offset: req.query.perPage * (req.query.page - 1),
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

// 특정 블루웨이의 특정 에리어에서 읽지 않은 대화 수 로드
router.get(
  "/blooways/:blooway/areas/:area/unreads",
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
        include: [
          {
            model: Area,
          },
        ],
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      const area = blooway.Areas.find(
        (v) => v.name === decodeURIComponent(req.params.area)
      );
      if (!area) {
        return res.status(404).send("존재하지 않는 에리어입니다.");
      }
      const count = await AreaTalk.count({
        where: {
          AreaId: area.id,
          createdAt: {
            [Op.gt]: new Date(+req.query.after),
          },
        },
      });
      return res.json(count);
    } catch (error) {
      next(error);
    }
  }
);

// 특정 에리어에서 대화 내용 생성
router.post(
  "/blooways/:blooway/areas/:area/talks",
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
        include: [
          {
            model: Area,
          },
        ],
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      const area = blooway.Areas.find(
        (v) => v.name === decodeURIComponent(req.params.area)
      );
      if (!area) {
        return res.status(404).send("존재하지 않는 에리어입니다.");
      }
      const talk = await AreaTalk.create({
        UserId: req.user.id,
        AreaId: area.id,
        content: req.body.content,
      });
      const talkWithUser = await AreaTalk.findOne({
        where: { id: talk.id },
        include: [
          {
            model: User,
          },
          {
            model: Area,
          },
        ],
      });
      const io = req.app.get("io");
      io.of(`/bw-${blooway.link}`)
        .to(`/bw-${blooway.link}-${area.id}`)
        .emit("message", talkWithUser);
      res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("mkdir uploads");
  fs.mkdirSync("uploads");
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 특정 에리어에서 다중 이미지 업로드
router.post(
  "/blooways/:blooway/areas/:area/images",
  isSignIn,
  upload.array("image"),
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
        include: [
          {
            model: Area,
          },
        ],
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      const area = blooway.Areas.find(
        (v) => v.name === decodeURIComponent(req.params.area)
      );
      if (!area) {
        return res.status(404).send("존재하지 않는 에리어입니다.");
      }
      for (let i = 0; i < req.files.length; i++) {
        const talk = await AreaTalk.create({
          UserId: req.user.id,
          AreaId: area.id,
          content: req.files[i].path,
        });
        const talkWithUser = await AreaTalk.findOne({
          where: { id: talk.id },
          include: [
            {
              model: User,
            },
            {
              model: Area,
            },
          ],
        });
        const io = req.app.get("io");
        io.of(`/bw-${blooway.link}`)
          .to(`/bw-${blooway.link}-${area.id}`)
          .emit("message", talkWithUser);
      }
      res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

// 특정 유저와의 프라이빗 대화 내용 로드
router.get(
  "/blooways/:blooway/privates/:id/talks",
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      return res.json(
        await blooway.getPrivates({
          where: {
            [Op.or]: [
              {
                SenderId: req.user.id,
                ReceiverId: req.params.id,
              },
              {
                SenderId: req.params.id,
                ReceiverId: req.user.id,
              },
            ],
          },
          include: [
            {
              model: User,
              as: "Sender",
              attributes: ["username", "id", "email"],
            },
            {
              model: User,
              as: "Receiver",
              attributes: ["username", "id", "email"],
            },
          ],
          order: [["createdAt", "DESC"]],
          limit: parseInt(req.query.perPage, 10),
          offset: req.query.perPage * (req.query.page - 1),
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

// 특정 유저와의 프라이빗 대화 중 읽지 않은 대화 수 로드
router.get(
  "/blooways/:blooway/privates/:id/unreads",
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      const count = await Private.count({
        where: {
          BloowayId: blooway.id,
          SenderId: req.params.id,
          ReceiverId: req.user.id,
          createdAt: {
            [Op.gt]: new Date(+req.query.after),
          },
        },
      });
      return res.json(count);
    } catch (error) {
      next(error);
    }
  }
);

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
// 특정 유저와의 프라이빗 대화 내용 생성
router.post(
  "/blooways/:blooway/privates/:id/talks",
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      const SenderId = req.user.id;
      const ReceiverId = req.params.id;
      const private = await Private.create({
        SenderId,
        ReceiverId,
        BloowayId: blooway.id,
        content: req.body.content,
      });
      const privateWithSender = await Private.findOne({
        where: { id: private.id },
        include: [
          {
            model: User,
            as: "Sender",
          },
        ],
      });
      const io = req.app.get("io");
      const onlineMap = req.app.get("onlineMap");
      const receiverSocketId = getKeyByValue(
        onlineMap[`/bw-${blooway.link}`],
        Number(ReceiverId)
      );
      io.of(`/bw-${blooway.link}`)
        .to(receiverSocketId)
        .emit("private", privateWithSender);
      res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

// 특정 유저와의 프라이빗 대화에서 다중 이미지 업로드
router.post(
  "/blooways/:blooway/privates/:id/images",
  upload.array("image"),
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      const SenderId = req.user.id;
      const ReceiverId = req.params.id;
      for (let i = 0; i < req.files.length; i++) {
        const private = await Private.create({
          SenderId,
          ReceiverId,
          BloowayId: blooway.id,
          content: req.files[i].path,
        });
        const privateWithSender = await Private.findOne({
          where: { id: private.id },
          include: [
            {
              model: User,
              as: "Sender",
            },
          ],
        });
        const io = req.app.get("io");
        const onlineMap = req.app.get("onlineMap");
        const receiverSocketId = getKeyByValue(
          onlineMap[`/bw-${blooway.link}`],
          Number(ReceiverId)
        );
        io.of(`/bw-${blooway.link}`)
          .to(receiverSocketId)
          .emit("private", privateWithSender);
      }
      res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

// 특정 블루웨이의 모든 멤버 목록 로드
router.get("/blooways/:blooway/members", isSignIn, async (req, res, next) => {
  try {
    const blooway = await Blooway.findOne({
      where: { link: req.params.blooway },
    });
    if (!blooway) {
      return res.status(404).send("존재하지 않는 블루웨이입니다.");
    }
    return res.json(
      await blooway.getMembers({
        attributes: ["id", "username", "email"],
      })
    );
  } catch (error) {
    next(error);
  }
});

// 특정 블루웨이에 새 멤버 생성
router.post("/blooways/:blooway/members", isSignIn, async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const blooway = await Blooway.findOne({
      where: { link: req.params.blooway },
      include: [
        {
          model: Area,
          where: {
            name: "전체",
          },
        },
      ],
    });
    if (!blooway) {
      await transaction.rollback();
      return res.status(404).send("존재하지 않는 블루웨이입니다.");
    }
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      await transaction.rollback();
      return res.status(404).send("존재하지 않는 사용자입니다.");
    }
    await blooway.addMembers(user, { transaction });
    await blooway.Areas[0].addMembers(user, { transaction });
    await transaction.commit();
    return res.send("ok");
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

// 특정 블루웨이의 멤버 삭제
router.delete(
  "/blooways/:blooway/members/:id",
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      await blooway.removeMembers({
        where: { id: parseInt(req.params.id, 10) },
      });
      return res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

// 특정 에리어의 모든 멤버 목록 로드
router.get(
  "/blooways/:blooway/areas/:area/members",
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      const area = blooway.Areas.find(
        (v) => v.name === decodeURIComponent(req.params.area)
      );
      if (!area) {
        return res.status(404).send("존재하지 않는 에리어입니다.");
      }
      return res.json(
        await area.getMembers({
          attributes: ["id", "username", "email"],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

// 특정 에리어에 새 멤버 생성
router.post(
  "/blooways/:blooway/areas/:area/members",
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      const area = blooway.Areas.find(
        (v) => v.name === decodeURIComponent(req.params.area)
      );
      if (!area) {
        return res.status(404).send("존재하지 않는 에리어입니다.");
      }
      const user = await User.findOne({
        where: { email: req.body.email },
        include: [
          {
            model: Blooway,
            as: "Blooways",
            through: {
              as: "Blooways",
              where: {
                BloowayId: blooway.id,
              },
            },
            required: true,
          },
        ],
      });
      if (!user) {
        return res.status(404).send("존재하지 않는 사용자입니다.");
      }
      await area.addMembers(user);
      return res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

// 특정 에리어의 멤버 삭제
router.delete(
  "/blooways/:blooway/areas/:area/members/:id",
  isSignIn,
  async (req, res, next) => {
    try {
      const blooway = await Blooway.findOne({
        where: { link: req.params.blooway },
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });
      if (!blooway) {
        return res.status(404).send("존재하지 않는 블루웨이입니다.");
      }
      const area = blooway.Areas.find(
        (v) => v.name === decodeURIComponent(req.params.area)
      );
      if (!area) {
        return res.status(404).send("존재하지 않는 에리어입니다.");
      }
      await area.removeMembers({
        where: { id: parseInt(req.params.id, 10) },
      });
      return res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

// 특정 블루웨이의 특정 유저 정보 로드
router.get("/blooways/:blooway/users/:id", async (req, res, next) => {
  try {
    const blooway = await Blooway.findOne({
      where: { link: req.params.blooway },
    });
    if (!blooway) {
      return res.status(404).send("존재하지 않는 블루웨이입니다.");
    }
    const user = await User.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Blooway,
          as: "Blooways",
          through: {
            where: {
              BloowayId: blooway.id,
            },
          },
          required: true,
        },
      ],
    });
    if (!user) {
      return res.status(404).send("존재하지 않는 사용자입니다.");
    }
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

// 내 정보 로드
router.get("/users", (req, res, next) => {
  return res.json(req.user || false);
});

// 새로운 계정 생성 (test 제거)
router.post("/users", isNotSignIn, async (req, res, next) => {
  try {
    const alreadyExisted = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (alreadyExisted) {
      return res.status(403).send("이미 사용중인 이메일입니다.");
    }
    const hashed = await bcrypt.hash(req.body.password, 13);
    const user = await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashed,
    });

    // 기본 블루웨이 생성
    const baseBlooway = await Blooway.create({
      name: user.username,
      link: user.username,
      BuilderId: user.id,
    });
    const baseArea = await Area.create({
      name: "전체",
      secret: false,
      BloowayId: baseBlooway.id,
    });
    await baseBlooway.addMembers(user);
    await baseArea.addMembers(user);
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 로그인
router.post("/users/signin", isNotSignIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.status(200).json(
        await User.findOne({
          where: { id: user.id },
          attributes: ["id", "username", "email"],
        })
      );
    });
  })(req, res, next);
});

// 로그아웃
router.post("/users/signout", isSignIn, (req, res) => {
  req.logout(() => {
    res.send("ok");
  });
});

module.exports = router;
