const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class PrivateTalk extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: "PrivateTalk",
        tableName: "privatetalks",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PrivateTalk.belongsTo(db.Blooway);
    db.PrivateTalk.belongsTo(db.User, { as: "Sender" });
    db.PrivateTalk.belongsTo(db.User, { as: "Receiver" });
  }
};
