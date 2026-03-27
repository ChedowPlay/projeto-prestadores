// 250204V

import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

module.exports = (db) => (
    db.define('works', {
        work_id: { type: DataTypes.STRING(40), primaryKey: true, allowNull: false, defaultValue: () => uuidv4() },
        description: { type: DataTypes.STRING(512), collate: 'SQL_Latin1_General_CP1_CI_AS' },
        price: { type: DataTypes.DOUBLE, defaultValue: 0, allowNull: false },
    }, {
    })
);
