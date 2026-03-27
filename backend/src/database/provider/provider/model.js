// 250219V

import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

module.exports = (db) => (
    db.define('providers', {
        provider_id: { type: DataTypes.STRING(40), primaryKey: true, defaultValue: () => uuidv4() },
        bio: { type: DataTypes.STRING(256), defaultValue: "", collate: 'SQL_Latin1_General_CP1_CI_AS' },
        
        mp_service_id: { type: DataTypes.STRING(40), unique: true, allowNull: true }, // id do pagamento
        paid_at: { type: DataTypes.DATE, defaultValue: null }, // Pago em
        payment_at: { type: DataTypes.DATE, defaultValue: null }, // Pagar em
        expiration_date: { type: DataTypes.DATE, defaultValue: null }, // Expirar em

        deleted_at: { type: DataTypes.DATE, defaultValue: null },
        banned_at: { type: DataTypes.DATE, defaultValue: null },
    }, {
    })
);
