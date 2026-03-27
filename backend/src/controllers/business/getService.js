// 250209V


import { readCategory } from "../../database/business/category/dao";
import { dbModel } from "../../database";


const getServices = async (req, res) => {
  try {


    const { success, categories: data } = await readCategory(
      {},
      {
        single: false,
        order: [["title", "ASC"]],
        include: [
          {
            model: dbModel.services,
            as: "services",
            order: [["title", "ASC"]],
            attributes: ["service_id", "title"],
          },
        ],
      }
    );
    if (!success) return res.status(500).json({ success: false, error: "Erro ao buscar serviços." });
    if (!Array.isArray(data)) return res.status(200).json({});


    const formatted = formatterService(data);
    return res.status(200).json(formatted);


  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro inesperado." });
  }
};


export const formatterService = (data) => {
  let count = 1;
  return data.reduce((acc, item) => {
    acc[item.title] = item.services.map((service) => ({
      service_id: service.service_id,
      label: service.title,
      value: count++,
    }));
    return acc;
  }, {});
};


export const formatReverseServices = (categories) => {
  let count = 1;
  return categories.reduce((acc, item) => {
    const services = item.services.map(service => ({
      service_id: service.service_id,
      label: service.title,
      value: count++,
    }));
    return [...acc, ...services];
  }, []);
};


export default getServices;
