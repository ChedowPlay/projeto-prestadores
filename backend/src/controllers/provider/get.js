// 250219V


import { readProvider } from "../../database/provider/provider/dao";
import { formatPublicLink } from "../../services/util";
import { dbModel } from "../../database";
import { literal } from "sequelize";
import { z } from "zod";


const getProviderSchema = z.object({
  provider_id: z.string().uuid("Precisa ser um id válido.").optional()
});


const getProvider = async (req, res) => {
  const hasUser = !!req?.user;
  // console.log("user:", JSON.stringify(req?.user, null, 2));
  // console.log("hasUser:", hasUser);


  try {
    const parsed = getProviderSchema.safeParse(req?.params);
    if (!parsed.success && !hasUser) return res.status(400).json({ success: false, issues: parsed?.error?.issues[0] || [], error: "Dados incorretos para consulta." });
    const { provider_id } = parsed.data;


    const filter = {};
    if (provider_id) {
      filter.provider_id = provider_id;
      filter.banned_at = null;
    }
    else filter.user_id = req?.user?.user_id;
    // console.log("filter:", JSON.stringify(filter, null, 2));


    const { success, provider: data } = await readProvider(filter, {
      single: true,
      include: [
        { as: "user", model: dbModel.users, },
        { as: "plan", model: dbModel.plans, },
        { as: "file", model: dbModel.files, attributes: ["file_id", "type", "url"] },
        {
          as: "work", model: dbModel.works, attributes: ["work_id", "description", "price"],
          include:
          {
            as: "service", model: dbModel.services,
            include: { as: "category", model: dbModel.categories, attributes: ["category_id", "title"] }
          }
        },
      ],
      attributes: {
        include: [
          [literal(`(SELECT MIN(price) FROM works WHERE works.provider_id = providers.provider_id)`), "min_price"],
          [literal(`(SELECT MAX(price) FROM works WHERE works.provider_id = providers.provider_id)`), "max_price"],
          [literal(`(SELECT AVG(price) FROM works WHERE works.provider_id = providers.provider_id)`), "avg_price"],
        ]
      }
    });
    if (!success) return res.status(404).json({ success: false, message: `Prestador não encontrado.` });

    // console.log(JSON.stringify(data, null, 2));
    // console.log("works:", JSON.stringify(formatWorks(data?.works), null, 2));


    const myResponse = {
      provider_id: data?.provider_id,

      bio: data?.bio,
      name: data?.user?.name,
      phone: data?.user?.phone,
      whatsapp: data?.user?.whatsapp,
      picture: formatPublicLink(data?.user?.picture_url),
      created_at: data?.created_at,

      price: {
        min: data?.dataValues?.min_price || 0,
        max: data?.dataValues?.max_price || 0,
        avg: data?.dataValues?.avg_price || 0,
      },

      works: {
        count: (data?.work ?? []).length,
        data: (data?.work ?? []).map((e) => ({
          work_id: e?.work_id,
          description: e?.description,
          price: e?.price,
          service: e?.service?.title,
          category: e?.service?.category?.title,
        }))
      },

      album: {
        count: (data?.file ?? []).length,
        data: (data?.file ?? []).map((e) => ({
          file_id: e?.file_id,
          type: e?.type,
          url: formatPublicLink(e?.url),
        })),
      },
    }


    // console.log("plan:", JSON.stringify(data?.plan, null, 2));
    // Adiciona dados confidências.
    if (hasUser) {
      myResponse.address = {
        cep: data?.user.cep,
        city: data?.user.city,
        state: data?.user.state,
        street: data?.user.street,
        number: data?.user.number,
        latitude: data?.user.latitude,
        longitude: data?.user.longitude,
      };

      const timestamp_pay = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
      const pay_at = new Date(timestamp_pay * 1000)

      myResponse.plan = {
        has_plan: !!data?.plan?.plan_id,
        plan_id: data?.plan?.plan_id,
        name: data?.plan?.name,
        paid_at: data?.paid_at,
        has_paid: !!data?.paid_at,
        pay_at: pay_at,
        price: data?.plan?.price,
        advantages: {
          image: data?.plan?.image,
          video: data?.plan?.video,
          service: data?.plan?.service,
        }
      }

      myResponse.user_id = data?.user_id;
      myResponse.email = data?.user?.email;
      myResponse.created_at = data?.user?.created_at;
    }
    else {
      myResponse.address = {
        city: data?.user.city,
        state: data?.user.state,
        street: data?.user.street,
      };
    }

    return res.status(200).json({ success: true, ...myResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erro inesperado." });
  }
};

export default getProvider;
