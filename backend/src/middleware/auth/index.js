// 250207V


import { validateToken } from "../../database/auth/token/dao.js";
import { readUser } from "../../database/account/user/dao.js";
import { z } from "zod";


// Esquema de validação do token
const authSchema = z.string().startsWith("Bearer ").min(50, "Token inválido");


export const isAuth = async (req, res, next) => {
    try {
        // Validação do cabeçalho Authorization
        const parsed = authSchema.safeParse(req.headers.authorization);
        if (!parsed.success) return res.status(401).json({ success: false, error: "Usuário não autenticado" }); // Usuário não encontrado


        // Validação do token no banco
        const token = req.headers.authorization.split(" ")[1];
        const { success, decoded, error } = await validateToken(token);
        if (!success || !decoded?.user_id) return res.status(401).json({ success: false, error: "Usuário não autenticado", logout: true }); // Token vencido


        // Obtém informações do usuário
        const userId = decoded.user_id;
        const dataUser = await readUser(
            {
                id: userId, attributes: [
                    "user_id",
                    "name",
                    "email",
                    "phone",
                    "number",
                    "street",
                    "last_accessed_at",
                    "picture_url",
                    "picture_path",
                    "created_at",
                    "updated_at"
                ]
            },
            { single: true }
        );


        // Validação do usuário
        if (!dataUser.success) {
            console.error("> [middleAuth] Erro ao autenticar usuário:", JSON.stringify(dataUser, null, 2));
            return res.status(401).json({ success: false, error: "Usuário não autenticado", logout: true }); // Erro ao buscar usuário
        }


        req.user = dataUser.user;
        req.userToken = token;
        req.userId = userId;


        next();
    } catch (error) {
        console.error("> [middleAuth] Erro inesperado:", error);
        return res.status(500).json({ success: false, error: "Erro inesperado" });
    }
};
