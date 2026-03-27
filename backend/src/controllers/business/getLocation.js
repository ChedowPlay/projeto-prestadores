// 250209V


import { readProvider } from "../../database/provider/provider/dao";
import { dbModel } from "../../database";


const getLocation = async (req, res) => {
  try {


    const { success, providers: data } = await readProvider(
      { banned_at: null },
      {
        single: false,
        attributes: ["provider_id"],
        include: [
          { as: "work", model: dbModel.works, attributes: ["work_id"] },
          { as: "user", model: dbModel.users, attributes: ["user_id", "state", "city"] },
        ],
      }
    );
    if (!success) return res.status(500).json({ success: false, error: "Erro ao buscar estados e cidades." });
    if (!Array.isArray(data)) return res.status(200).json({});


    const formatted = formatterLocation(data);
    return res.status(200).json(formatted);
    // return res.status(200).json(data);


  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro inesperado." });
  }
};


export const formatterLocation = (data) => {
  // Filter providers with works
  const filteredData = data.filter(provider => provider.work && provider.work.length > 0);

  // Transform the data
  return filteredData.reduce((acc, provider) => {
    const state = provider?.user?.state;
    const city = provider?.user?.city;

    if (state && city) {
      if (!acc[state]) acc[state] = [];

      // Check if city already exists in the state array
      const cityExists = acc[state].some(item => item.label === city);
      if (!cityExists) {
        acc[state].push({
          label: city,
          value: Object.values(acc).flat().length + 1
        });
      }
    }

    return acc;
  }, {});
};


export const formatReverseLocations = (data) => {
  let count = 1;
  const locations = [];
  
  // Group by state and city
  data.reduce((acc, provider) => {
    const state = provider?.user?.state;
    const city = provider?.user?.city;
    
    if (state && city) {
      const key = `${state}-${city}`;
      if (!acc[key]) {
        acc[key] = true;
        locations.push({
          id: count,
          state: state,
          label: city,
          value: count++
        });
      }
    }
    return acc;
  }, {});

  return locations;
};


export default getLocation;
