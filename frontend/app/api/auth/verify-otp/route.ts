// app/api/auth/verify-otp/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession } from "@/app/lib/sessions";
import { getProvider } from "@/app/Pages/loggedArea/actions";
import { z } from "zod";

// Schema de validação
const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
});

export async function POST(request: Request) {
  try {
    // 1. Validação dos dados de entrada
    const requestData = await request.json();
    const parsedData = otpSchema.safeParse(requestData);

    if (!parsedData.success) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos" },
        { status: 400 }
      );
    }

    const { email, otp } = parsedData.data;

    // 2. Verificação do OTP
    const otpResponse = await fetch(
      `${process.env.API_URL}/auth/check-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      }
    );

    if (!otpResponse.ok) {
      const errorData = await otpResponse.json();
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Código inválido",
        },
        { status: 400 }
      );
    }

    const { token } = await otpResponse.json();

    // 3. Obter dados do usuário
    const userData = await getProvider(token);
    if (!userData?.user_id) {
      throw new Error("Dados do usuário incompletos");
    }

    // 4. Configuração segura de cookies
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 3,
      path: "/",
    });

    // 5. Criar sessão (se necessário)
    if (typeof createSession === "function") {
      await createSession(userData.user_id);
    }

    // 6. Retorno seguro
    return NextResponse.json({
      success: true,
      user: {
        id: userData.user_id,
        email: userData.email,
        name: userData.name,
        // ... outros campos não sensíveis
      },
      // O token é retornado apenas para o frontend
      // mas não é armazenado em cookies não-httpOnly
      token,
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro durante a verificação",
      },
      { status: 500 }
    );
  }
}
