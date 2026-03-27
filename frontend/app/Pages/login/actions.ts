"use server";

import { createSession, deleteSession } from "@/app/lib/sessions";

import { cookies } from "next/headers";
import { getProvider } from "../loggedArea/actions";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Email invalido" }).trim(),
  password: z.string().min(8, { message: "Senha invalida" }).trim(),
});

export async function login(
  state:
    | { errors?: { email?: string[]; password?: string[] }; message?: string }
    | undefined,
  payload: FormData
) {
  const result = loginSchema.safeParse(Object.fromEntries(payload));
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { email, password } = result.data;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(
      `${API_URL}/auth/signin`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (response.status !== 200) {
      return {
        errors: { email: ["Credenciais inválidas"], password: [" "] },
        message: "Falha no login",
      };
    }

    const providerData = await getProvider(data.token);

    if (!providerData?.user_id) {
      throw new Error("Dados do usuário incompletos");
    }

    // 1. Cria a sessão segura (HTTP-only)
    await createSession(providerData.user_id);

    // 2. Configura o cookie HTTP-only (para o middleware)
    (await cookies()).set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 3, // 3 horas
    });

    // 3. Retorna os dados necessários para o frontend
    return {
      success: true,
      providerData, // Dados do usuário
      token: data.token, // Token acessível ao JS
      message: "Login realizado com sucesso",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      message: "Erro durante o login",
      errors: { email: ["Erro de servidor"] },
    };
  }
}

export async function logout() {
  (await cookies()).delete("auth_token");
  (await cookies()).delete("session");
  await deleteSession();

  redirect("/Pages/login");
}
