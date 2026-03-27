// 250203V

import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';

module.exports = (db) =>
  db.define('otps', {
    otp_id: { type: DataTypes.INTEGER(), primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(128), allowNull: false },
    attempts: { type: DataTypes.INTEGER, allowNull: false },
    objective: { type: DataTypes.ENUM('password change', 'validate email'), allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
  }, {
    hooks: {
      beforeCreate: async (otps) => {
        if (otps.code) otps.code = await bcrypt.hash(otps.code, 10);
      },
    }
  });