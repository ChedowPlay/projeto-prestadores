// 250206V

import { createProvider } from "../../database/provider/provider/dao.js";
import { readUser } from "../../database/account/user/dao.js";
import { readPlan } from "../../database/business/plan/dao.js";

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
]

export const insertProvider = async () => {
    try {
        const { success: plansSuccess, plans } = (await readPlan());
        // console.log(plansSuccess, JSON.stringify(plans, null, 2));


        for (let i = 0; i < emails.length; i++) {

            const dataUser = (await readUser({ email: emails[i] })).user;
            const userId = dataUser?.user_id;


            const randomDays = Math.floor(Math.random() * 15) + 1; // Gera um número aleatório entre 1 e 15
            const data = {
                user_id: userId,
                bio: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor. Aenean massa.`,
                paid_at: new Date(),
                plan_id: plans[Math.floor(Math.random() * plans.length)].plan_id,
                expiration_date: new Date(new Date().setDate(new Date().getDate() + randomDays)), // Adiciona os dias aleatórios
            };
            
            if (emails[i] === "banido@email.com") data.banned_at = new Date();


            const { success, created } = await createProvider(data);
            // console.log("> [Insert.Provider]: success:", success, "created:", created);
        }
        return true;
    } catch (error) {
        console.error(`> [Insert.Provider] Erro ao inserir dados: ${error.message}`);
        return false;
    }
};

