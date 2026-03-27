// 250215V

import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

module.exports = (db) => (
    db.define('files', {
        file_id: { type: DataTypes.STRING(40), primaryKey: true, defaultValue: () => uuidv4() },
        provider_id: {
            type: DataTypes.STRING(40),
            allowNull: false,
            references: {
                model: 'providers',
                key: 'provider_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        type: { type: DataTypes.ENUM('image', 'video'), allowNull: false },
        path: { type: DataTypes.STRING(512), defaultValue: null },
        url: { type: DataTypes.STRING(328), allowNull: false },
    }, {
    })
);
