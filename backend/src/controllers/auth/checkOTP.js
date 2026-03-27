// 250303V


import { validadePassword } from "../../services/validators";
import { createToken } from "../../database/auth/token/dao";
import { readUser } from "../../database/account/user/dao";
import { validateOTP } from "../../database/auth/otp/dao";
import { isAuth } from "../../middleware/auth";
import { z } from "zod";


const checkOtpSchema = z.object({
  otp: z.string().length(6),
  email: z.string().email().optional(),
  password: z.string().min(6).max(128).optional(),
});


const checkOTP = async (req, res) => {
  try {
    // Validação dos dados recebidos
    const parsed = checkOtpSchema.safeParse(req?.body);
    if (!parsed.success) return res.status(400).json({ success: false, issues: parsed?.error?.issues[0] || [], error: "Dados inválidos." });


    const { otp, email, password } = parsed.data;
    let user, objective;


    // Verifica se há token no header
    const hasToken = !!req.headers.authorization;


    if (hasToken) {
      // Se houver token, autenticar usuário
      await isAuth(req, res, async () => {
        user = req.user;
        objective = "validate email";
      });

      if (!user) return;
    } else {
      // Se não houver token, então é recuperação de senha e precisa de email e da nova senha.
      if (!email) return res.status(400).json({ success: false, error: "E-mail é obrigatório para criação de nova senha." });
      if (!password) return res.status(400).json({ success: false, error: "Senha é obrigatório para criação de nova senha." });

      const { success: successPassword, error } = validadePassword(password);
      if (!successPassword) return res.status(422).json({ success: false, error });

      const userData = await readUser({ email }, { single: true });
      if (!userData.success) return res.status(404).json({ success: false, error: "Usuário não encontrado." });

      user = userData.user;
      objective = "password change";
    }


    // Regra: se for validate email, precisa de token; se for password change, não pode ter token
    if ((objective === "validate email" && !hasToken) || (objective === "password change" && hasToken)) {
      return res.status(400).json({ success: false, error: "Autenticação inválida para este objetivo." });
    }


    // Buscar OTP no banco de dados e garante que pertence ao usuário correto
    // console.log("code:", otp, "user_id:", user.user_id);

    const otpRecord = await validateOTP({ code: otp, user_id: user.user_id });
    // console.log("otpRecord:", JSON.stringify(otpRecord, null, 2));
    if (!otpRecord.success) return res.status(400).json({ success: false, error: "Código OTP incorreto ou expirado." });


    // Se for validação de email, atualizar email_check do usuário
    switch (objective) {
      case "validate email":
        user.email_checked_at = new Date();
        const saved = await user.save();
        console.log(">>> saved:", JSON.stringify(saved, null, 2));
        return res.status(200).json({ success: true, message: "E-mail validado com sucesso." });
        break;


      case "password change":
        user.password = password;
        const isPasswordChange = await user.save();
        console.log('>>> password change:', !!JSON.stringify(isPasswordChange, null, 2));

        const tokenData = await createToken({ user_id: user.user_id, access: "password_change" });
        const code = tokenData?.code;
        if (!code) return res.status(500).json({ error: "Erro interno" }); // Erro de geração de token

        return res.status(201).json({ success: true, message: "Senha alterada com sucesso.", token: code });
        break;
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erro inesperado." });
  }
};


export default checkOTP;
