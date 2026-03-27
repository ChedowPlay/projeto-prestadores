"use server";

import { cookies } from "next/headers";
import { createSession } from "@/app/lib/sessions";
import { getProvider } from "../loggedArea/actions";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email({ message: "Email inválido" }).trim(),
  password: z.string().min(8, { message: "Senha inválida" }).trim(),
  name: z.string().min(1, { message: "Nome inválido" }).trim(),
});

export async function register(
  state:
    | {
        errors?: {
          email?: string[];
          password?: string[];
          name?: string[];
        };
        message?: string;
      }
    | undefined,
  payload: FormData
) {
  const result = registerSchema.safeParse(Object.fromEntries(payload));
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password, name } = result.data;
  const API_URL = process.env.API_URL;
  try {
    const response = await fetch(
      `${API_URL}/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: "0000000000", // Valor padrão temporário
          accept_privacy_policy: true,
          accept_terms_use: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        errors: {
          email: [data.message || "Email já cadastrado"],
        },
        message: "Falha no registro",
      };
    }

    // 1. Cria a sessão segura (HTTP-only)
    await createSession(data.id);

    // 2. Configura o cookie HTTP-only (para o middleware)
    (await cookies()).set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 3, // 3 horas
    });

    // 3. Obtém os dados completos do usuário
    const providerData = await getProvider(data.token);

    // 4. Envia o email de verificação
    await sendEmailToken(data.email, data.token);

    // 5. Retorna os dados necessários para o frontend
    return {
      success: true,
      providerData, // Dados completos do usuário
      token: data.token, // Token acessível ao JS
      message: "Registro realizado com sucesso",
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      message: "Ocorreu um erro durante o registro",
      errors: {
        email: ["Erro de servidor"],
      },
    };
  }
}
export async function sendEmailToken(email: string, token?: string) {
  const API_URL = process.env.API_URL;
  const TOKEN = token; // Deixe vazio para testar sem token
  const EMAIL = email; // Defina um email válido se não houver token

  if (!TOKEN && !EMAIL) {
    console.error("Token ou email são obrigatórios.");
  } else {
    fetch(API_URL + "/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify(TOKEN ? {} : { email: EMAIL }), // Envia o email apenas se não houver token
    })
      .then((resp) => {
        resp.json();
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export async function validateToken(
  email: string,
  otp: string,
  password: string
) {
  const API_URL = process.env.API_URL;
  const TOKEN = ""; // Insira um token válido para testar com autenticação
  const EMAIL = email; // Insira um email válido para testar sem autenticação
  const OTP = otp;
  const PASSWORD = password;

  if (!EMAIL && !TOKEN) {
    console.error("Token ou email são obrigatórios.");
    return {
      errors: {
        general: ["Token ou email são obrigatórios."],
      },
    };
  } else {
    const bodyData: { otp: string; email?: string; password?: string } = {
      otp: OTP,
    };
    if (!TOKEN) bodyData.email = EMAIL; // Adiciona o email apenas se não houver token
    if (!TOKEN) bodyData.password = PASSWORD; // Adiciona a senha apenas se não houver token

    try {
      const response = await fetch(API_URL + "/auth/check-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao validar o token:", errorData);
        return {
          errors: {
            otp: ["código invalido"],
          },
        };
      }

      const data = await response.json();

      (await cookies()).set("auth_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 3, // 3 horas
      });

      (await cookies()).set("user-id", data.userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 3, // 3 horas
      })
      getProvider(data.token);
      return data;
    } catch (error) {
      console.error("Erro ao validar o token:", error);
      return {
        errors: {
          otp: ["Ocorreu um erro ao validar o token."],
        },
      };
    }
  }
}

export async function authWithProvider(provider: string, accessToken: unknown) {
  const API_URL = process.env.API_URL;
  if (accessToken !== undefined) {
    try {
      const response = await fetch(
        `${API_URL}/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessProvider: provider,
            accessToken: accessToken,
          }),
        }
      );

      const data = await response.json();
      (await cookies()).set("auth_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 3, // 3 horas
      });

      (await cookies()).set("user-id", data.userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 3, // 3 horas
      });

      await createSession(data.id);
    } catch (error) {
      console.error(error);
    }
  }
}
