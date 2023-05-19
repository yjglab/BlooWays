const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Blooway extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        link: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.STRING(100),
          allowNull: false,
          defaultValue: "",
        },
      },
      {
        modelName: "Blooway",
        tableName: "blooways",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Blooway.belongsTo(db.User, { as: "Builder", foreignKey: "BuilderId" });
    db.Blooway.belongsToMany(db.User, {
      through: db.BloowayMember,
      as: "Members",
    });
    db.Blooway.hasMany(db.Area);
    db.Blooway.hasMany(db.Private);
  }
};
