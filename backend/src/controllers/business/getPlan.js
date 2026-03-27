// 250314V

import { readPlan } from "../../database/business/plan/dao.js";


const getPlans = async (req, res) => {
  try {
    const { success, plans: data } = await readPlan({},
      {
        single: false,
        order: [["price", "ASC"]],
        attributes: ["plan_id", "name", "price", "image", "video", "service"]
      }
    );

    if (!success) return res.status(500).json({ success: false, error: "Erro ao buscar planos." });
    if (!Array.isArray(data)) return res.status(200).json({});

    const formatted = formatterPlans(data);
    return res.status(200).json(formatted);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro inesperado." });
  }
};

export const formatterPlans = (data) => {
  return data.map((plan) => ({
    plan_id: plan.plan_id,
    name: plan.name,
    price: plan.price,
    advantages: {
      image: plan.image,
      video: plan.video,
      service: plan.service
    }
  }));
};

export default getPlans;