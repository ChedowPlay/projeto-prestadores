// 250129V

import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

module.exports = (db) => (
    db.define('categories', {
        category_id: { type: DataTypes.STRING(40), primaryKey: true, defaultValue: () => uuidv4() },
        title: { type: DataTypes.STRING(128), unique: true, allowNull: false, collate: 'SQL_Latin1_General_CP1_CI_AS' },
    }, {
    })
);
