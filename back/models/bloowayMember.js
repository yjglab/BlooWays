const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class BloowayMember extends Model {
  static init(sequelize) {
    return super.init(
      {
        signInAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        modelName: "BloowayMember",
        tableName: "bloowaymembers",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {}
};
