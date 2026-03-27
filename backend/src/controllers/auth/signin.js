// 250303V


import { readUser, validatePassword } from "../../database/account/user/dao.js";
import { formatPublicLink } from "../../services/util/index.js";
import { createToken } from "../../database/auth/token/dao.js";
import { z } from "zod";


const loginSchema = z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).max(128).optional(),
    accessProvider: z.enum(["credentials"]).default("credentials"),
}).refine((data) => {
    if (data.accessProvider === 'credentials') {
        return !!data.email && !!data.password;
    }
    return true;
}, {
    message: `E-mail e senha são necessários para "credentials".`,
    path: ["email"],
});


const signin = async (req, res) => {
    try {
        // Validação dos dados
        const parsed = loginSchema.safeParse(req?.body);
        if (!parsed.success) return res.status(400).json({ success: false, issues: parsed?.error?.issues[0] || [], error: "Dados incorretos." });
        const { email, password, accessProvider } = parsed.data;


        let userDataProvider;


        // Dados incorretos
        if (!email && !password) return res.status(400).json({ success: false, error: "Usuário ou senha incorretos." });
        userDataProvider = {
            email: email.toLocaleLowerCase()
        };
        console.log("payload login:", JSON.stringify(userDataProvider, null, 2));


        // Busca usuário no banco de dados
        const { user: myUserData } = await readUser({ email: userDataProvider.email }, { single: true });
        if (!myUserData) return res.status(404).json({ success: false, error: "Usuário ou senha incorretos." }); // Usuário não encontrado


        // Validação da senha
        if (accessProvider === "credentials") {
            const validadePass = await validatePassword({ id: myUserData.user_id, password });
            if (!validadePass.success) return res.status(401).json({ success: false, error: "Usuário ou senha incorretos." }); // Senha incorreta
        }


        // Geração de token
        const tokenData = await createToken({ user_id: myUserData.user_id, access: `signin_${accessProvider}` });
        const code = tokenData?.code;
        if (!code) return res.status(500).json({ success: false, error: "Erro interno" }); // Erro de geração de token


        // Atualiza informações do usuário
        let is_first_access = !myUserData.last_accessed_at;
        if (is_first_access) console.log("> [signin] Primeiro acesso do usuário:", myUserData.name);
        myUserData.last_accessed_at = new Date();
        myUserData.save();


        // Construtor response
        const response = {
            success: true,
            message: "Acesso permitido",
            token: code,
            picture: formatPublicLink(myUserData.picture_url),
            is_first_access: is_first_access,
            id: myUserData.user_id,
            name: myUserData.name,
            email: myUserData.email,
            whatsapp: myUserData.whatsapp,
            address: {
                cep: myUserData.cep,
                city: myUserData.city,
                state: myUserData.state,
                street: myUserData.street,
                number: myUserData.number,
                latitude: myUserData.latitude,
                longitude: myUserData.longitude,
            },
        }


        // Retorno da autenticação
        // return res.status(200).json(dataUser); // APENAS PARA TESTES!
        return res.status(200).json(response);
    } catch (error) {
        console.error("> [signin] ", error);
        return res.status(500).json({ success: false, error: "Erro inesperado." });
    }
};

export default signin;
