const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Mention extends Model {
  static init(sequelize) {
    return super.init(
      {
        category: {
          type: DataTypes.ENUM("area", "privateTalk", "common"),
          allowNull: false,
        },
        talkId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        modelName: "Mention",
        tableName: "mentions",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Mention.belongsTo(db.Blooway);
    db.Mention.belongsTo(db.User, { as: "Sender", foreignKey: "SenderId" });
    db.Mention.belongsTo(db.User, { as: "Receiver", foreignKey: "ReceiverId" });
  }
};
