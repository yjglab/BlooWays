const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        username: {
          type: DataTypes.STRING(16),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        social: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        socialId: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
      },
      {
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Blooway, { as: "Built", foreignKey: "BuilderId" });
    db.User.belongsToMany(db.Blooway, {
      through: db.BloowayMember,
      as: "Blooways",
    });
    db.User.belongsToMany(db.Area, { through: "AreaMembers" });
    db.User.hasMany(db.AreaTalk);
  }
};
