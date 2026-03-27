// 250213V

import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';


module.exports = (db) => (
    db.define('users', {
        user_id: { type: DataTypes.STRING(40), primaryKey: true, allowNull: false, defaultValue: () => uuidv4() },
        name: { type: DataTypes.STRING(128), allowNull: false, collate: 'SQL_Latin1_General_CP1_CI_AS' },
        phone: { type: DataTypes.STRING(15) },
        password: { type: DataTypes.STRING(128), defaultValue: "", collate: 'SQL_Latin1_General_CP1_CI_AS' },
        auth: { type: DataTypes.ENUM('credentials', 'google', 'facebook'), defaultValue: 'credentials' },

        email: { type: DataTypes.STRING(328), allowNull: false, unique: true },
        email_checked_at: { type: DataTypes.DATE, defaultValue: null },

        whatsapp: { type: DataTypes.STRING(15) },
        picture_url: { type: DataTypes.STRING(328) },
        picture_path: { type: DataTypes.STRING(512), defaultValue: null },

        cep: { type: DataTypes.STRING(8) },
        city: { type: DataTypes.STRING(64), collate: 'SQL_Latin1_General_CP1_CI_AS' },
        state: { type: DataTypes.STRING(64), collate: 'SQL_Latin1_General_CP1_CI_AS' },
        street: { type: DataTypes.STRING(64), collate: 'SQL_Latin1_General_CP1_CI_AS' },
        number: { type: DataTypes.STRING(8) },
        latitude: { type: DataTypes.STRING(12) },
        longitude: { type: DataTypes.STRING(12) },
        allow_see_address: { type: DataTypes.BOOLEAN, defaultValue: true },

        last_accessed_at: { type: DataTypes.DATE, defaultValue: null },

        accept_privacy_Policy: { type: DataTypes.BOOLEAN, defaultValue: false },
        accept_terms_use: { type: DataTypes.BOOLEAN, defaultValue: false },

        deleted_at: { type: DataTypes.DATE, defaultValue: null },
    }, {
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) user.password = await bcrypt.hash(user.password, 12);
                if (user.email) user.email = user.email.toLowerCase();
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) user.password = await bcrypt.hash(user.password, 12);
                if (user.changed('email')) user.email = user.email.toLowerCase();
            }
        }
    })
);
