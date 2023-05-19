const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class AreaTalk extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: "AreaTalk",
        tableName: "areaTalks",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.AreaTalk.belongsTo(db.User);
    db.AreaTalk.belongsTo(db.Area);
  }
};
