// 250315V


import { readUser, createUser } from "../../database/account/user/dao.js";
import { createProvider } from "../../database/provider/provider/dao.js";
import { formatPublicLink } from "../../services/util/index.js";
import { createToken } from "../../database/auth/token/dao.js";
import { validadePassword } from "../../services/validators";
import { z } from "zod";


const signupSchema = z.object({

    // USUÁRIO COMUM
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(128).optional(),
    phone: z.string().min(10).max(15).optional(),

    whatsapp: z.string().min(10).max(15).optional(),

    accept_privacy_Policy: z.boolean().optional(),
    accept_terms_use: z.boolean().optional(),

    allow_see_address: z.boolean().optional(),
    address: z.object({
        cep: z.string().min(8).max(8),
        city: z.string().min(2).max(64),
        state: z.string().min(2).max(2),
        street: z.string().min(2).max(64),
        number: z.string().min(1).max(8),
        latitude: z.string().min(12).max(12).optional(),
        longitude: z.string().min(12).max(12).optional(),
    }).optional(),

    // Origem de criação de conta
    accessProvider: z.enum(["credentials"]).default("credentials"),
}).refine((data) => {
    if (data.accessProvider === 'credentials') return !!data.email && !!data.password && !!data.name;
    return true;
}, {
    message: `E-mail e senha são necessários para "credentials".`,
    path: ["email"],
});


const signup = async (req, res) => {
    try {
        // Validação dos dados
        const parsed = signupSchema.safeParse(req?.body);
        if (!parsed.success) return res.status(400).json({ success: false, issues: parsed?.error?.issues[0] || [], error: "Dados incorretos." });
        const { email, password, address, provider, accessProvider } = parsed.data;


        // Dados incorretos
        if (!email && !password) return res.status(400).json({ success: false, error: "Usuário ou senha incorretos." });


        const { success, error } = validadePassword(password);
        if (!success) return res.status(422).json({ success: false, error });

        let userData = { ...parsed.data, email: email.toLocaleLowerCase(), password };
        console.log("payload criação:", JSON.stringify(userData, null, 2));


        // Verifica se o usuário já existe
        const { user: existingUser } = await readUser({ email: userData.email });
        if (existingUser) return res.status(409).json({ error: "E-mail em uso." });


        // Validação de lógica antes de criar o usuário
        // Endereço é obrigatório para a criação de um prestador
        if (accessProvider === "credentials" && provider && !address) return res.status(400).json({ error: "Endereço é obrigatório para prestadores." });


        // Criação do usuário
        const { user: newUser, success: successNewUser, created: createdNewUser } = await createUser({
            ...userData?.address,

            name: userData.name,
            email: userData.email,
            password: userData?.password,
            picture_url: userData?.picture_url,

            phone: userData?.phone,
            whatsapp: userData?.whatsapp,
            accept_privacy_Policy: userData?.accept_privacy_Policy,
            accept_terms_use: userData?.accept_terms_use,

            auth: accessProvider,

            email_checked_at: userData?.email_checked_at,
        });
        if (!successNewUser) return res.status(500).json({ error: "Erro ao criar usuário." });
        if (!createdNewUser) return res.status(500).json({ error: "Usuário não criado." });


        // Cria provider em branco
        const { success: successProvider, provider: newProvider } = await createProvider({ user_id: newUser.user_id, bio: "" });
        console.log("New Provider:", JSON.stringify(newProvider, null, 2));
        if (!successProvider) {
            newUser.destroy();
            return res.status(500).json({ error: "Erro ao gerar provider, usuário não cadastrado." });
        }


        // Geração de token
        const tokenData = await createToken({ user_id: newUser.user_id, access: `signin_${accessProvider}` });
        const code = tokenData?.code;
        if (!code) {
            newUser.destroy();
            newProvider.destroy();
            return res.status(500).json({ error: "Erro ao gerar token, usuário não cadastrado." });
        }


        // Construtor response
        const response = {
            success: true,
            message: "Conta criada com sucesso.",
            token: code,
            user_id: newUser.user_id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            is_fisrt_access: true,
            accept_privacy_Policy: newUser.accept_privacy_Policy,
            accept_terms_use: newUser.accept_terms_use,
            picture: formatPublicLink(newUser.picture_url),
            whatsapp: newUser.whatsapp,
            address: {
                cep: newUser.cep,
                city: newUser.city,
                state: newUser.state,
                street: newUser.street,
                number: newUser.number,
                latitude: newUser.latitude,
                longitude: newUser.longitude,
            },
            provider: {
                provider_id: newProvider.provider_id,
                bio: newProvider.bio,
                paid_at: newProvider.paid_at,
                payment_at: newProvider.payment_at,
                expiration_date: newProvider.expiration_date,
            }
        }


        // Retorno do cadastro
        // return res.status(201).json({ ...newUser, ...newProvider, code });
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro inesperado." });
    }
};


export default signup;
