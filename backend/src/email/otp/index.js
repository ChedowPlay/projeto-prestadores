// 250307V


import { formatPublicLink } from '../../services/util';
import { env } from '../../services/env';
import { emailConfig } from '..';
import path from 'path';
import ejs from 'ejs';


// const HTML_LOCATION = path.join(__dirname, 'template.html');
// const SEND_EMAILS = env.SEND_EMAILS;


export const sendEmailCode = async (data = {
    target: '',
    title: 'Código de validação',
    code: '',
    test: false,
    type: 'validation' // ou "password"
}) => {
    const { target, title, code, test, type } = data;

    if (code === '') {
        return {
            success: false,
            message: 'Código de validação não pode ser vazio.'
        };
    }

    try {
        // Renderiza o template usando a mesma técnica do controller de teste
        const html = await render(code, type);

        let logMailEngine = null;
        if (!test && env.SEND_EMAILS) {
            logMailEngine = await sendMail({ html, code, target, title });
        } else {
            !test && console.warn(`⚠️ Email não enviado: SEND_EMAILS está como ${env.SEND_EMAILS} ou test está como ${test}`);
        }

        return { success: true, logMailEngine };
    } catch (error) {
        console.error(`Erro fatal ao enviar email:`, error);
        return { success: false, message: 'Erro ao enviar email' };
    }
};


const render = async (code, type) => {
    // Define o caminho para o template (mesmo utilizado no controller de teste)
    const templatePath = path.join(process.cwd(), 'src/email/otp/template.html');

    const data = {
        codigo: code,
        // logo: formatPublicLink("static/img/logo.png"), 
        /*
        <div class="footer-logo" style="text-align: center;">
            <img src="<%= logo %>" alt="Logo Di Boa Club" width="60" height="66">
        </div>
        */
        metodo: "",
        type: ""
    };

    // Define mensagens de acordo com o tipo de e-mail
    switch (type) {
        case "validation":
            data.metodo = "confirmar seu e-mail";
            data.type = "confirmação";
            data.title = `Confirmação de e-mail: ${code}`;
            break;
        case "password":
            data.metodo = "redefinir a sua senha";
            data.type = "alteração";
            data.title = `Redefinição de senha: ${code}`;
            break;
        default:
            data.metodo = "";
            data.type = "";
            data.title = "";
    }

    // Retorna uma promise para o HTML renderizado
    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, data, {}, (err, html) => {
            if (err) {
                console.error("> [getHtmlTemplate] Erro ao renderizar o template:", err);
                return reject(err);
            }
            resolve(html);
        });
    });
};

const sendMail = async ({
    identifier = "diboa club",
    html,
    code,
    target,
    title
}) => {
    try {
        return await emailConfig.sendMail(
            {
                from: `${identifier} <${env.EMAIL_USER}>`,
                to: target,
                subject: title,
                text: `Código de validação: [${code}]`,
                html,
            }
        );
    } catch (error) {
        console.error(`Erro ao enviar email:`, error);
        return null;
    }
};
