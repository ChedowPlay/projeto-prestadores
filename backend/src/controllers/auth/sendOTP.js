// 250303V


import { readUser } from "../../database/account/user/dao";
import { createOTP } from "../../database/auth/otp/dao";
import { sendEmailCode } from "../../email/otp";
import { isAuth } from "../../middleware/auth";
import { z } from "zod";


const sendOtpSchema = z.object({
  email: z.string().email().optional(),
});


const sendOTP = async (req, res) => {
  try {
    // Validação dos dados
    const parsed = sendOtpSchema.safeParse(req?.body);
    if (!parsed.success) return res.status(400).json({ success: false, issues: parsed?.error?.issues[0] || [], error: "Dados inválidos." });

    const { email } = parsed.data;
    let user, objective;

    // Se houver token, autenticar usuário
    if (req.headers.authorization) {
      await isAuth(req, res, async () => {
        user = req.user;
        objective = "validate email";
      });

      if (!user) return;
    } else {
      // Se não houver token, o email deve estar no body
      if (!email) return res.status(400).json({ success: false, error: "Faltando E-mail ou Token." });

      // Buscar usuário pelo email
      const userData = await readUser({ email }, { single: true });
      // console.log(JSON.stringify(userData, null, 2));

      if (!userData.success) return res.status(404).json({ success: true, message: `Código de segurança enviado.` }); // Email não encontrado

      objective = "password change";
      user = userData.user;
    }


    // Criar OTP no banco de dados
    const { otp, code, success, error, status } = await createOTP({ user_id: user.user_id, objective });
    if (!success) return res.status(status || 500).json({ success: false, error: error || "Erro ao gerar OTP." });


    // Envio de email
    const emailType = objective === "password change" ? "password" : "validation";
    const emailTitle = objective === "password change"
      ? `Redefinição de senha: ${code}`
      : `Confirmação de e-mail: ${code}`;

    const emailConfig = {
      target: user.email,
      code,
      title: emailTitle,
      test: false,
      type: emailType,
    };

    const emailLog = await sendEmailCode(emailConfig);
    if (!emailLog.success) {
      otp.destroy();
      console.error("Erro ao enviar email:", emailLog.error);
      return res.status(500).json({ success: false, error: "Erro inesperado." }); // Erro ao enviar email
    }


    const censoredEmail = user.email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + b.replace(/./g, "*") + c);
    const message = `Código de segurança para o e-mail: ${censoredEmail}.`;
    console.log(`> [sendOTP]: Código de segurança ${code} enviado para o e-mail: ${censoredEmail}. Objetivo: ${objective}`);


    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erro inesperado." });
  }
};

export default sendOTP;
