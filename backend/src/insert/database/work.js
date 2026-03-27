import { readProvider } from "../../database/provider/provider/dao.js";
import { readService } from "../../database/business/service/dao.js";
import { createWork } from "../../database/provider/work/dao.js";
import { dbModel } from "../../database/index.js";

const emails = [
    "teste1@email.com", 
    "teste2@email.com", 
    "banido@email.com",
    
    "teste5@email.com",
    "teste6@email.com",
    "teste7@email.com",
    "teste8@email.com",
    "teste9@email.com",
    "teste10@email.com"
];

export const insertWork = async () => {
    try {
        // Busca os prestadores específicos (teste1, teste2 e banido)
        const { providers: providersData } = await readProvider({}, {
            single: false,
            include: [
                { as: "user", model: dbModel.users, attributes: ["user_id", "email"] },
                { as: "work", model: dbModel.works }
            ]
        });

        const targetProviders = providersData.filter(provider =>
            provider.user?.email && emails.includes(provider.user.email)
        );

        // Busca todos os serviços disponíveis
        const { services: servicesData } = await readService({}, { single: false });
        const servicesId = servicesData.map((e) => e.service_id);

        // Cria 2 works para cada prestador que ainda não tem works
        for (const provider of targetProviders) {
            // Verifica quantos works o prestador já tem
            const existingWorks = provider.work?.length || 0;
            const worksToCreate = Math.max(0, 2 - existingWorks);

            if (worksToCreate === 0) {
                // console.log(`> [Insert.Work]: ${provider.user.email} já possui ${existingWorks} works. Pulando...`);
                continue;
            }

            for (let i = 0; i < worksToCreate; i++) {
                const data = {
                    provider_id: provider.provider_id,
                    service_id: servicesId[i % servicesId.length],
                    description: `Work ${i + 1} do ${provider.user.email}: Lorem ipsum dolor sit amet, consectetuer adipiscing elit.`,
                    price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
                };

                const { success, error } = await createWork(data);
                // if (!success) console.error(`> [Insert.Work]: Erro ao criar work para ${provider.user.email}: ${error}`);
                // else console.log(`> [Insert.Work]: Work criada com sucesso para ${provider.user.email}`);
            }
        }
        return true;
    } catch (error) {
        console.error(`> [Insert.Work] Erro ao inserir dados: ${error.message}`);
        return false;
    }
};