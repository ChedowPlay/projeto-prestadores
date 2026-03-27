import { SignJWT, jwtVerify } from "jose";

import { cookies } from "next/headers";

const secretKey = process.env.AUTH_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);
interface SessionData {
  user_id: string;

}


export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 horas
  const session = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("3h")
    .sign(encodedKey);

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function decrypt(session: string | undefined = "") {
  try {
    if (!session) return null;
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as { userId: string };
  } catch (error) {
    console.error("Failed to decrypt session:", error);
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

export async function getSessionData(): Promise<SessionData | null> {
  const session = (await cookies()).get('session')?.value;
  
  if (!session) return null;
  
  return {
    user_id: session,
  };
}
