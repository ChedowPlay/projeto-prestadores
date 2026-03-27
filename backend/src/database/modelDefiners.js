// 250210V


/**
 * Define todos os modelos de acordo com suas pastas
 * A const modelDefinersList possui itens cuja a ordem importa
 */
export const modelDefiners = (db) => {
    try {
        // A ORDEM IMPORTA, CUIDADO!
        const modelDefinersList = [
            // ACCOUNT
            require('./account/user/model.js'),
            
            // AUTH
            require('./auth/token/model.js'),
            require('./auth/otp/model.js'),

            // BUSINESS
            require('./business/category/model.js'),
            require('./business/service/model.js'),
            require('./business/plan/model.js'),
            
            // PROVIDER
            require('./provider/provider/model.js'),
            require('./provider/work/model.js'),
            require('./provider/file/model.js'),
            
            // INTERACTIONS
            require('./interactions/favorite/model.js'),
            require('./interactions/complaint/model.js'),
        ];

        // Mapeia cada definer para uma função que retorna uma promessa de definição de modelo
        const modelPromises = modelDefinersList.map((definer) => definer(db));

        // Retorna uma promessa que é resolvida quando todas as definições de modelo forem concluídas
        return Promise.all(modelPromises);
    } catch (error) {
        console.error('> db.models Error:', error);
        throw error; // Rejeita a promessa se houver um erro na definição do modelo
    }
}
