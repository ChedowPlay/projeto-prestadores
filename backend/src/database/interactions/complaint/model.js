// 250204V

import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

module.exports = (db) => (
    db.define('complaints', {
        complaint_id: { type: DataTypes.STRING(40), primaryKey: true, defaultValue: () => uuidv4() },
        description: { type: DataTypes.STRING(512), allowNull: false, collate: 'SQL_Latin1_General_CP1_CI_AS' },
    }, {
    })
);
