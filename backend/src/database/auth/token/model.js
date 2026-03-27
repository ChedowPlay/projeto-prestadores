// 250203V


import { DataTypes } from "sequelize";

module.exports = (db) =>
  db.define('tokens', {
    token_id: { type: DataTypes.INTEGER(40), primaryKey: true, autoIncrement: true },
    access: { type: DataTypes.STRING(128), allowNull: true },
    code: { type: DataTypes.STRING(256), allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
  }, {});