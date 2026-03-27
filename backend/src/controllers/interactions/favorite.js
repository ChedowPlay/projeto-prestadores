// 250213V


import { createFavorite, readFavorite } from "../../database/interactions/favorite/dao";
import { dbModel } from "../../database";
import { z } from "zod";


const favoriteSchema = z.object({
  provider_id: z.string().uuid(),
});


const favoritesController = async (req, res) => {
  try {
    const user = req.user;


    switch (req.method) {
      case "GET": {
        const { success, favorites, error } = await readFavorite(
          { user_id: user.user_id, }, {
          single: false,
          order: [["updated_at", "DESC"]],
          include: [
            {
              model: dbModel.providers,
              as: "favorite",
              attributes: ["provider_id", "bio", "about", "user_id"],
              include: [
                {
                  model: dbModel.users,
                  as: "user",
                  attributes: ["picture"],
                },
              ],
            },
          ],
        });

        // Filtro
        const list = favorites.map((item, i) => {
          return {
            provider_id: item.favorite.provider_id,
            // user_id: item.favorite?.user_id,
            bio: item.favorite?.bio,
            about: item.favorite?.about,
            picture: item.favorite.user?.picture_url,
          }
        });

        return res.status(200).json({ success: true, favorites: list });
      }


      case "POST": {
        const parsed = favoriteSchema.safeParse(req.body);
        const { provider_id } = parsed.data;
        if (!parsed.success) return res.status(400).json({ success: false, error: "Dados inválidos." });
        // console.log("> ", "user_id:", user.user_id, "favorited_id:", provider_id);

        // Cria favorito
        const { favorite, success, created, error, status } = await createFavorite({ user_id: user.user_id, favorited_id: provider_id });
        if (!success) return res.status(500).json({ success: false, error: "Erro inesperado. Ou prestador não encontrado." });
        if (created) return res.status(200).json({ success: true, message: "Adicionado aos favoritos." });

        // Remove favorito
        const resume = await favorite.destroy();
        if (!resume) return res.status(500).json({ success: false, error: "Erro inesperado." });
        return res.status(200).json({ success: true, message: "Removido dos favoritos" });
      }


      default:
        return res.status(405).json({ success: false, error: "Método não permitido." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erro inesperado." });
  }
};


export default favoritesController;
