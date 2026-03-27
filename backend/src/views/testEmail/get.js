// 250307V


import { formatPublicLink } from "../../services/util";
import path from "path";
import { z } from "zod";
import ejs from "ejs";


const getSchema = z.object({
    type: z.enum(["validation", "password"]),
});


const testEmail = async (req, res) => {
    const parsed = getSchema.safeParse(req?.params);
    if (!parsed.success) return res.status(400).json({ success: false, issues: parsed?.error?.issues[0] || [], error: "Dados incorretos." });
    const { type } = parsed.data;

    try {
        const templatePath = path.join(process.cwd(), 'src/email/otp/template.html');


        const data = {
            codigo: "0Lt5 LinD0",
            logo: formatPublicLink("static/img/logo.png"),
            metodo: "",
            type: "",
        };
        switch (type) {
            case "validation":
                data.metodo = "confirmar seu e-mail";
                data.type = "confirmação";
                data.title = "Confirmação de e-mail: 0Lt5 LinD0";
                break;

            case "password":
                data.metodo = "redefinir a sua senha";
                data.type = "alteração";
                data.title = "Redefinição de senha: 0Lt5 LinD0";
                break;

            default:
                data.metodo = "";
                data.type = "";
                data.title = "";
        }


        ejs.renderFile(templatePath, data, {}, (err, html) => {
            if (err) {
                console.error("> [emailTest.render] Error: Não foi possível renderizar o template:", err);
                return res.status(500).send("Erro interno do servidor");
            }
            res.status(200).send(html);
        });
    } catch (error) {
        if (req.status_debug) {
            error["params"] = req.query || req.body;
            return res.status(500).json({ error });
        } else {
            return res.status(400).json({ error: "Erro inesperado" });
        }
    }
};


export default testEmail;
