// 250317V

import { createPlan, readPlan } from "../../database/business/plan/dao.js";
import mercadopago from "../../services/mercadopago/index.js";

/*
89.90
159.90
249.90
*/

const data = {
    "DI BOA": { price: 89.90, image: 5, video: 2, service: 2 },
    "MEGA DI BOA": { price: 159.90, image: 12, video: 6, service: 5 },
    "DI BOA TOTAL": { price: 249.90, image: 40, video: 30, service: 10 },
};


export const insertPlan = async () => {
    // Objeto para armazenar os planos do Mercado Pago indexados por nome (sem o prefixo "Plano ")
    const mpPlans = {};

    try {
        const { success, plans } = await mercadopago.getPlan(null, { status: "active" });

        if (success && plans && plans.results && plans.results.length > 0) {
            const dataPlans = plans.results;

            // Indexa os planos do Mercado Pago pelo nome (removendo o prefixo "Plano ")
            for (const mpPlan of dataPlans) {
                const planName = mpPlan.reason.replace(/^Plano /, '');
                mpPlans[planName] = mpPlan;
            }

            console.log(`> [Insert.Plan]: ${dataPlans.length} planos encontrados no Mercado Pago`);
        } else {
            console.log(`> [Insert.Plan]: Nenhum plano encontrado no Mercado Pago`);
        }
    } catch (error) {
        console.log(`> [Insert.Plan]: Erro ao obter planos do Mercado Pago: ${error.message}`);
    }


    try {
        for (const name of Object.keys(data)) {
            const info = data[name];

            // Verifica se o plano já existe no banco de dados
            const { success, plans } = await readPlan({ name: name }, { single: false });

            // Verifica se o plano existe no Mercado Pago
            const mpPlan = mpPlans[name];
            const mpPlanExists = !!mpPlan;

            // Verifica se o preço do plano no Mercado Pago corresponde ao preço local
            const mpPlanPriceMatches = mpPlanExists &&
                mpPlan.auto_recurring &&
                mpPlan.auto_recurring.transaction_amount === info.price;


            // Caso 1: Plano não existe no banco de dados
            if (success && plans.length === 0) {
                // Cria o plano no banco de dados
                const planData = {
                    name: name,
                    price: info.price,
                    image: info.image,
                    video: info.video,
                    service: info.service
                };

                // Se o plano já existe no Mercado Pago com o mesmo preço, usa o ID existente
                if (mpPlanExists && mpPlanPriceMatches) {
                    planData.mp_plan_id = mpPlan.id;
                }

                const { success: createSuccess, created, plan } = await createPlan(planData);
                console.log(`> [Insert.Plan]: ${name} - success: ${createSuccess}, created: ${created}`);

                // Se o plano foi criado com sucesso no banco de dados e não existe no Mercado Pago ou o preço é diferente
                if (createSuccess && created && (!mpPlanExists || !mpPlanPriceMatches) && !info.mp_plan_id) {
                    try {
                        // Configuração do plano no Mercado Pago
                        const mpPlanData = {
                            reason: name,
                            amount: info.price,
                        };

                        // Cria o plano no Mercado Pago
                        const { success: mpSuccess, plan: newMpPlan } = await mercadopago.createPlan(mpPlanData);

                        // Atualiza o plano no banco de dados com o ID do plano no Mercado Pago
                        if (mpSuccess) {
                            plan.mp_plan_id = newMpPlan.id;
                            await plan.save();
                            console.log(`> [Insert.Plan]: Plano ${name} criado no Mercado Pago com sucesso. ID: ${newMpPlan.id}`);
                        }
                        else {
                            await plan.destroy();
                            console.error(`> [Insert.Plan]: Erro ao criar plano ${name} no Mercado Pago`);
                        }
                    } catch (mpError) {
                        console.error(`> [Insert.Plan]: Erro ao criar plano ${name} no Mercado Pago: ${JSON.stringify(mpError.message, null, 2)}`);
                    }
                } else if (createSuccess && created && planData.mp_plan_id) {
                    console.log(`> [Insert.Plan]: Plano ${name} criado no banco de dados com ID do Mercado Pago existente: ${planData.mp_plan_id}`);
                }
            }

            // Caso 2: Plano já existe no banco de dados
            else if (success && plans.length > 0) {
                const dbPlan = plans[0];

                // Se o plano existe no banco mas não tem mp_plan_id e existe no Mercado Pago com preço correspondente
                if (!dbPlan.mp_plan_id && mpPlanExists && mpPlanPriceMatches) {
                    // Atualiza o plano no banco com o ID do Mercado Pago
                    dbPlan.mp_plan_id = mpPlan.id;
                    await dbPlan.save();
                    console.log(`> [Insert.Plan]: Plano ${name} atualizado com ID do Mercado Pago: ${mpPlan.id}`);
                }
                // Se o plano existe no banco mas não tem mp_plan_id e não existe no Mercado Pago ou o preço é diferente
                else if (!dbPlan.mp_plan_id && (!mpPlanExists || !mpPlanPriceMatches) && !info.mp_plan_id) {
                    try {
                        // Configuração do plano no Mercado Pago
                        const mpPlanData = {
                            reason: name,
                            amount: info.price,
                        };

                        // Cria o plano no Mercado Pago
                        const { success: mpSuccess, plan: newMpPlan } = await mercadopago.createPlan(mpPlanData);

                        // Atualiza o plano no banco de dados com o ID do plano no Mercado Pago
                        if (mpSuccess) {
                            dbPlan.mp_plan_id = newMpPlan.id;
                            await dbPlan.save();
                            console.log(`> [Insert.Plan]: Plano ${name} criado no Mercado Pago com sucesso. ID: ${newMpPlan.id}`);
                        }
                        else console.error(`> [Insert.Plan]: Erro ao criar plano ${name} no Mercado Pago`);

                    } catch (mpError) {
                        console.error(`> [Insert.Plan]: Erro ao criar plano ${name} no Mercado Pago: ${JSON.stringify(mpError.message, null, 2)}`);
                    }
                }
                else console.log(`> [Insert.Plan]: Plano ${name} já existe e está sincronizado. Pulando...`);
            }
        }
        return true;
    } catch (error) {
        console.error(`> [Insert.Plan] Erro ao inserir dados: ${error.message}`);
        return false;
    }
};