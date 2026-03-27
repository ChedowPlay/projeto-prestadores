// 250303V

import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

module.exports = (db) => (
    db.define('plans', {
        plan_id: { type: DataTypes.STRING(40), primaryKey: true, defaultValue: () => uuidv4() },
        mp_plan_id: { type: DataTypes.STRING(40), unique: true, allowNull: true }, // REVER
        name: { type: DataTypes.STRING(125), unique: true, allowNull: false },
        price: { type: DataTypes.DOUBLE, defaultValue: 0, allowNull: false },
        image: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        video: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        service: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    }, {
    })
);
