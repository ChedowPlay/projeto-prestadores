// 250207V


import { deleteToken } from "../../database/auth/token/dao.js";


const logout = async (req, res) => {
    try {
        const code = req.userToken;


        // Remove o token do banco
        const resume = await deleteToken({ code });
        if (!resume.success) return res.status(404).json({ error: "Token não encontrado." });


        // Retorno de sucesso
        return res.status(200).json({ success: true, message: "Logout realizado com sucesso.", logout: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro inesperado." });
    }
};


export default logout;
