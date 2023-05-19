const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Blooway = require("../models/blooway");
const Area = require("../models/area");
const AreaTalk = require("../models/areaTalk");
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

module.exports = router;
