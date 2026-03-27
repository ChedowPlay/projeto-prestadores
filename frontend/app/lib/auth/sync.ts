// app/lib/auth/sync.ts

import { createSession, decrypt } from "../sessions";

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

export async function syncAuthSystems(req: NextRequest) {
  const token = await getToken({ req });
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // Se tiver token mas não tiver sessão
  if (token && !session) {
    await createSession(token.sub!);
  }
  
  // Se tiver sessão mas não tiver token
  if (session && !token) {
    // Aqui você pode implementar a criação do token JWT se necessário
  }
}
