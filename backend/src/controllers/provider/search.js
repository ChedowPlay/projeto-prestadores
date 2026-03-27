// 250219V


import { readCategory } from "../../database/business/category/dao";
import { readProvider } from "../../database/provider/provider/dao";
import { formatReverseLocations } from "../business/getLocation";
import { formatReverseServices } from "../business/getService";
import { formatPublicLink } from "../../services/util";
import { decToBin } from "../../services/binary";
import { dbModel } from "../../database";
import { Op, literal } from "sequelize";
import { getDistance } from 'geolib';
import { z } from "zod";


const priceSchema = z.object({
  min: z.number().min(0.0).optional(),
  max: z.number().min(0.0).optional(),
  sort: z.enum(['asc', 'desc']).optional(),
}).refine(e => {
  if (e.min && e.max) return e.min <= e.max;
  return true;
}, {
  message: "O preço mínimo deve ser menor ou igual ao preço máximo"
});

const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  min: z.number().min(0).max(1000).optional(), // km
  max: z.number().min(0).max(1000).optional(), // km
  sort: z.enum(['asc', 'desc']).optional(),
}).refine(e => {
  if (e.min && e.max) return e.min <= e.max;
  return true;
}, {
  message: "A distância mínima deve ser menor ou igual à distância máxima"
});

const locationSchema = z.object({
  state: z.string().min(2).max(2).optional(),
  cities: z.number().int().min(1).optional(),
  // sort: z.enum(['asc', 'desc']).optional(),
});

const searchParamsSchema = z.object({
  services: z.number().int().min(1).optional(),
  price: priceSchema.optional(),
  coordinates: coordinatesSchema.optional(),
  location: locationSchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});


export const search = async (req, res) => {
  const parsed = searchParamsSchema.safeParse({
    services: req.query.services ? Number(req.query.services) : undefined,

    price: {
      min: req.query.minprice ? Number(req.query.minprice) : undefined,
      max: req.query.maxprice ? Number(req.query.maxprice) : undefined,
      sort: req.query.sortprice,
    },

    coordinates: req.query.lat && req.query.lon ? {
      lat: Number(req.query.lat),
      lon: Number(req.query.lon),
      min: req.query.mindistance ? Number(req.query.mindistance) : undefined,
      max: req.query.maxdistance ? Number(req.query.maxdistance) : undefined,
      sort: req.query.sortdistance,
    } : undefined,

    location: {
      cities: req.query.cities ? Number(req.query.cities) : undefined,
      state: req.query.state?.toUpperCase(),
      // sort: req.query.sortdistance,
    },

    page: Number(req.query.page) || 1,
    // limit: Number(req.query.limit) || 10,
    limit: 10, // Bloquado para 10 elementos
  });

  try {
    if (!parsed.success) return res.status(400).json({ success: false, issues: parsed?.error?.issues[0] || [], error: "Dados incorretos para consulta." });
    const { services: decServices, price, coordinates, page, limit, location } = parsed.data;


    const workWhere = {};

    // FILTROS PREÇOS
    if (price?.min || price?.max) {
      workWhere.price = {};
      if (price.min) workWhere.price[Op.gte] = price.min;
      if (price.max) workWhere.price[Op.lte] = price.max;
    }


    // FILTRO SERVIÇOS
    if (decServices) {
      const { categories } = await readCategory({}, {
        single: false,
        order: [["title", "ASC"]],
        include: [{
          model: dbModel.services,
          as: "services",
          order: [["title", "ASC"]]
        }],
      });

      const myServices = formatReverseServices(categories);
      const binArray = decToBin(decServices, myServices.length).reverse();
      const serviceIds = myServices
        .filter((_, index) => binArray[index] > 0)
        .map(service => service.service_id);
      console.log("> dec:", decServices, "bin:", binArray.join(), "idsServices:", serviceIds.join());

      // return res.status(200).json(myServices); // Testes
      if (serviceIds.length > 0) workWhere.service_id = { [Op.in]: serviceIds };
    }


    // FILTRO LOCALIZAÇÃO CIDADE E ESTADO E ASSINATURA VÁLIDA
    const now = new Date();
    const providerWhere = {
      banned_at: null,
      expiration_date: { [Op.or]: [{ [Op.gt]: now }] } // Assinatura em dia
    };
    if (location.state) providerWhere['$user.state$'] = location.state;

    if (location.cities) {
      const { success: locSuccess, providers: locData } = await readProvider(
        { banned_at: null },
        {
          single: false,
          attributes: ["provider_id"],
          include: [
            { as: "work", model: dbModel.works, attributes: ["work_id"] },
            { as: "user", model: dbModel.users, attributes: ["user_id", "state", "city"] }
          ],
        }
      );

      if (locSuccess) {
        const cities = formatReverseLocations(locData);
        const binArray = decToBin(location.cities, cities.length).reverse();

        const selectedCities = cities
          .filter((_, index) => binArray[index] > 0)
          .map(city => ({ state: city.state, city: city.label }));

        const idsCities = selectedCities.map(e => ` ${e.state} ${e.city}`).join();
        console.log("> dec:", location.cities, "bin:", binArray.join(), `idsCities:${idsCities}`);

        if (selectedCities.length > 0) {
          providerWhere[Op.or] = selectedCities.map(loc => ({
            '$user.state$': loc.state,
            '$user.city$': loc.city
          }));
        }

        // return res.status(200).json(cities); // Apenas para testes
      }
    }


    // MOTOR DE BUSCA PRINCIPAL DO PRESTADOR
    const { success, providers: rawProviders } = await readProvider(
      providerWhere,
      {
        single: false,
        offset: (page - 1) * limit,
        limit,
        include: [
          {
            as: "work",
            model: dbModel.works,
            where: workWhere,
            required: true,
            separate: true,
            attributes: ["work_id", "provider_id", "service_id", "description", "price"],
            order: [["price", "ASC"]],
            include: {
              as: "service",
              model: dbModel.services,
              attributes: ["service_id", "title"],
              include: {
                as: "category",
                model: dbModel.categories,
                attributes: ["category_id", "title"]
              }
            }
          },
          {
            as: "user",
            model: dbModel.users,
            attributes: ["user_id", "name", "picture_url", "state", "city", "latitude", "longitude", "created_at"]
          }
        ],
        attributes: {
          include: [
            [literal(`(SELECT MIN(price) FROM works WHERE works.provider_id = providers.provider_id)`), "min_price"],
            [literal(`(SELECT MAX(price) FROM works WHERE works.provider_id = providers.provider_id)`), "max_price"],
            [literal(`(SELECT AVG(price) FROM works WHERE works.provider_id = providers.provider_id)`), "avg_price"],
          ]
        }
      }
    );
    if (!success) return res.status(500).json({ success: false, error: "Erro ao buscar prestadores." });
    // console.log(JSON.stringify(rawProviders, null, 2));


    // Filtra providers que não têm works e faz o remapping.
    let providers = rawProviders.filter(provider => provider.work && provider.work.length > 0)
      .map(provider => ({
        provider_id: provider?.provider_id,
        user_id: provider?.user?.user_id,

        bio: provider?.bio,
        name: provider?.user?.name,
        // email: provider?.user?.email,
        // whatsapp: provider?.user?.whatsapp,
        picture: formatPublicLink(provider?.user?.picture_url),
        created_at: provider?.user?.created_at,

        address: {
          city: provider?.user?.city,
          state: provider?.user?.state,
          street: provider?.user.street,
        },

        coordinates: coordinates ? {
          latitude: provider?.user?.latitude,
          longitude: provider?.user?.longitude,
          // Coloca providers sem localização por último
          distance: Number.MAX_SAFE_INTEGER,
        } : null,

        price: {
          min: provider?.dataValues?.min_price || 0,
          max: provider?.dataValues?.max_price || 0,
          avg: provider?.dataValues?.avg_price || 0,
        },

        business: Array.from(
          (provider?.work ?? []).reduce((unique, work) => {
            const key = `${work?.service?.title}-${work?.service?.category?.title}`;
            return unique.set(key, {
              service: work?.service?.title,
              category: work?.service?.category?.title,
            });
          }, new Map()).values()
        ),

      }));


    // Calcula e filtra por distância se as coordenadas foram fornecidas
    if (coordinates) {
      providers = providers.map(provider => {
        const lat = Number(provider?.coordinates?.latitude);
        const lon = Number(provider?.coordinates?.longitude);

        if (!isNaN(lat) && !isNaN(lon) &&
          lat >= -90 && lat <= 90 &&
          lon >= -180 && lon <= 180) {
          const distance = getDistance(
            { latitude: coordinates.lat, longitude: coordinates.lon },
            { latitude: lat, longitude: lon }
          ) / 1000;
          return { ...provider, coordinates: { ...provider.coordinates, distance } };
        }
        return { ...provider, coordinates: { ...provider.coordinates, distance: Number.MAX_SAFE_INTEGER } };
      });

      // Filtra por distância mínima e máxima
      if (coordinates.min || coordinates.max) {
        providers = providers.filter(provider => {
          const distance = provider.coordinates.distance;
          const minOk = coordinates.min ? distance >= coordinates.min : true;
          const maxOk = coordinates.max ? distance <= coordinates.max : true;
          return minOk && maxOk;
        });
      }
    }

    // Ordenação combinada (distância e preço)
    providers.sort((a, b) => {
      // Primeiro critério: distância (se houver coordenadas e sort)
      if (coordinates?.sort) {
        const distanceComparison = a.coordinates.distance - b.coordinates.distance;
        if (distanceComparison !== 0) {
          return coordinates.sort === "desc" ? -distanceComparison : distanceComparison;
        }
      }

      // Segundo critério: preço
      if (price?.sort) {
        const aPrice = a.price.min || 0;
        const bPrice = b.price.min || 0;
        return price.sort === "desc" ? bPrice - aPrice : aPrice - bPrice;
      }

      return 0; // mantém a ordem original se não houver critérios de ordenação
    });


    // Ajuste na paginação para refletir o total real
    const total = providers.length;
    providers = providers.slice((page - 1) * limit, page * limit);

    return res.status(200).json({
      success: true,
      data: providers,
      pagination: {
        page,
        limit,
        total,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erro inesperado." });
  }
};

export default search;
