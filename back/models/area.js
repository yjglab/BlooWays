const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Area extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(14),
          allowNull: false,
        },
        secret: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
      },
      {
        modelName: "Area",
        tableName: "areas",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Area.belongsTo(db.Blooway);
    db.Area.hasMany(db.AreaTalk, { as: "Talks" });
    db.Area.belongsToMany(db.User, {
      through: "AreaMembers",
      as: "Members",
    });
  }
};
