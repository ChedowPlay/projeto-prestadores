// 250210V

import { createCategory } from "../../database/business/category/dao.js";
import { createService } from "../../database/business/service/dao.js";


const dataset = {
    "Reparos e Manutenção": [
        { title: "Eletricista" },
        { title: "Encanador" },
        { title: "Pintor" },
        { title: "Carpinteiro" },
        { title: "Marcenaria" },
        { title: "Reformas" },
        { title: "Jardinagem" },
    ],

    "Serviços Domésticos": [
        { title: "Faxina" },
        { title: "Passadeira" },
        { title: "Cozinheira" },
        { title: "Babá" },
        { title: "Cuidador de Idosos" },
    ],

    "Eventos e Festas": [
        { title: "Buffet" },
        { title: "Decoração" },
        { title: "DJ" },
        { title: "Fotógrafo" },
        { title: "Videomaker" },
        { title: "Aluguel de Espaço" },
    ],

    "Assistência Técnica": [
        { title: "Conserto de Eletrônicos" },
        { title: "Conserto de Eletrodomésticos" },
        { title: "Conserto de Celulares" },
        { title: "Assistência de Computadores" },
    ],

    "Beleza e Bem-Estar": [
        { title: "Cabeleireiro" },
        { title: "Manicure/Pedicure" },
        { title: "Massagista" },
        { title: "Personal Trainer" },
        { title: "Esteticista" },
    ],

    "Transportes e Logística": [
        { title: "Mudanças" },
        { title: "Frete" },
        { title: "Transporte Executivo" },
        { title: "Motorista Particular" },
    ],

    "Tecnologia": [
        { title: "Suporte Técnico" },
        { title: "Instalação de Redes" },
        { title: "Consultoria de TI" },
        { title: "Desenvolvimento Web" },
        { title: "Desenvolvimento Backend" },
    ],
    
    "Educação": [
        { title: "Aulas Particulares" },
        { title: "Reforço Escolar" },
        { title: "Cursos de Idiomas" },
        { title: "Aulas de Música" },
        { title: "Treinador Pokemon" },
    ],
}


export const insertCategoryAndService = async () => {
    try {
        for (const category of Object.keys(dataset)) {
            // console.log('> Inserindo Categoria:', category);


            const myCategory = await createCategory({ title: category });
            // console.log(JSON.stringify(myCategory, null, 2));

            const categoryId = myCategory.category.category_id;


            for (const item of dataset[category]) {
                // console.log('  + Serviço:', item.title);
                await createService({ category_id: categoryId, title: item.title });
            }
        }
        return true;
    } catch (error) {
        console.error(`Erro ao inserir Categorias e Serviços: ${error}`);
        return false;
    }
};
