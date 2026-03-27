// app/lib/server/userState.server.ts
'use server';

import { ProviderData } from "../Pages/loggedArea/actions";
import { cookies } from "next/headers";

export async function setServerUserData(data: ProviderData) {
  (await cookies()).set('userData', JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 semana
  });
}

export async function getServerUserData(): Promise<ProviderData> {
  const cookie = (await cookies()).get('userData')?.value;
  if (!cookie) throw new Error("User data not found in cookies");
  return JSON.parse(cookie);
}
