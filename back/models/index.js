const Sequelize = require("sequelize");
const user = require("./user");
const blooway = require("./blooway");
const bloowayMember = require("./bloowayMember");
const area = require("./area");
const areaTalk = require("./areaTalk");
const private = require("./private");
const mention = require("./mention");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = user;
db.Blooway = blooway;
db.BloowayMember = bloowayMember;
db.Area = area;
db.AreaTalk = areaTalk;
db.Private = private;
db.Mention = mention;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
