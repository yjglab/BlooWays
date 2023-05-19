const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Private extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: "Private",
        tableName: "privates",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Private.belongsTo(db.Blooway);
    db.Private.belongsTo(db.User, { as: "Sender" });
    db.Private.belongsTo(db.User, { as: "Receiver" });
  }
};
