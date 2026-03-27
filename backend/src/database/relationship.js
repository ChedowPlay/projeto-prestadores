import { dbModel } from ".";

export const relationship = async () => {
    const {
        // ACCOUNT
        users,

        // AUTH
        tokens,
        otps,

        // BUSINESS
        categories,
        services,
        plans,

        // PROVIDER
        providers,
        works,
        files,

        // INTERACTIONS
        complaints,
        favorites,
    } = dbModel;

    try {
        /*** Associação entre Users e Providers ***/
        // Cada provider pertence a um usuário (um usuário pode ter, opcionalmente, um provider)
        await providers.belongsTo(users, {
            as: 'user',
            foreignKey: { name: 'user_id', allowNull: false, unique: true }
        });
        await users.hasOne(providers, {
            as: 'provider',
            foreignKey: { name: 'user_id', allowNull: false, unique: true }
        });


        /*** Associação entre Users e Tokens ***/
        // Um token pertence a um usuário e um usuário pode ter vários tokens
        await tokens.belongsTo(users, {
            as: 'user',
            foreignKey: { name: 'user_id', allowNull: false }
        });
        await users.hasMany(tokens, {
            as: 'tokens',
            foreignKey: 'user_id'
        });

        /*** Associação entre Users e Otps ***/
        // Um OTP pertence a um usuário e um usuário pode ter vários OTPs
        await otps.belongsTo(users, {
            as: 'user',
            foreignKey: { name: 'user_id', allowNull: false }
        });
        await users.hasMany(otps, {
            as: 'otps',
            foreignKey: 'user_id'
        });


        /*** Associação entre Users, Providers e Complaints ***/
        // Cada denúncia pertence a um usuário acusador (um usuário pode fazer várias denúncias, mas apenas uma por prestador)
        await complaints.belongsTo(users, {
            as: 'accuser',
            foreignKey: { name: 'user_id', allowNull: true }
        });
        // Cada denúncia pertence a um prestador acusado (um prestador pode ser denunciado várias vezes)
        await complaints.belongsTo(providers, {
            as: 'accused',
            foreignKey: { name: 'provider_id', allowNull: false }
        });
        // Um usuário pode ter várias denúncias feitas, mas precisa garantir que só tenha uma por prestador
        await users.hasMany(complaints, {
            as: 'complaintsAsAccuser',
            foreignKey: 'user_id',
            constraints: true
        });
        // Um prestador pode receber muitas denúncias de diferentes usuários
        await providers.hasMany(complaints, {
            as: 'complaintsAsAccused',
            foreignKey: 'provider_id'
        });


        /*** Associação entre Users e Favorites ***/
        // Cada registro de favorito possui dois relacionamentos: o usuário que criou o favorito e o usuário que foi favoritado
        await favorites.belongsTo(users, {
            as: 'user',
            foreignKey: { name: 'user_id', allowNull: false }
        });
        await favorites.belongsTo(providers, {
            as: 'favorite',
            foreignKey: { name: 'favorited_id', allowNull: false }
        });
        await users.hasMany(favorites, {
            as: 'favoritesCreated',
            foreignKey: 'user_id'
        });
        await providers.hasMany(favorites, {
            as: 'favoritedBy',
            foreignKey: 'favorited_id'
        });

        /*** Associação entre Providers e Files ***/
        // Cada arquivo (foto ou vídeo) pertence a um prestador
        await files.belongsTo(providers, {
            as: 'provider',
            foreignKey: { name: 'provider_id', allowNull: false }
        });
        await providers.hasMany(files, {
            as: 'file',
            foreignKey: 'provider_id'
        });


        /*** Associação entre Providers e Works ***/
        // Cada trabalho pertence a um prestador; um prestador pode ter vários trabalhos
        await works.belongsTo(providers, {
            as: 'provider',
            foreignKey: { name: 'provider_id', allowNull: false }
        });
        await providers.hasMany(works, {
            as: 'work',
            foreignKey: 'provider_id'
        });


        /*** Associação entre Works e Services ***/
        // Cada trabalho está associado a um tipo de serviço; um serviço pode estar associado a vários trabalhos
        await works.belongsTo(services, {
            as: 'service',
            foreignKey: { name: 'service_id', allowNull: false }
        });
        await services.hasMany(works, {
            as: 'work',
            foreignKey: 'service_id'
        });


        /*** Associação entre Services e Categories ***/
        // Cada serviço pertence a uma categoria; uma categoria pode ter vários serviços
        await services.belongsTo(categories, {
            as: 'category',
            foreignKey: { name: 'category_id', allowNull: false }
        });
        await categories.hasMany(services, {
            as: 'services',
            foreignKey: 'category_id'
        });


        /*** Associação entre Providers e Plans ***/
        // Cada plano tem nenhum ou mais providers e cada provider tem um e apenas um plan
        await plans.hasMany(providers, {
            as: 'providers',
            foreignKey: 'plan_id',
        });
        
        await providers.belongsTo(plans, {
            as: 'plan', // Deve ser singular
            foreignKey: 'plan_id',
        });

    } catch (error) {
        console.error('> db.relationship Error:', error);
        process.exit(1);
    }
};
