// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { decrypt } from "./app/lib/sessions";

const protectedRoutes = ["/Pages/loggedArea", "/Pages/planos", "/Pages/settings"];
const publicRoutes = ["/Pages/login", "/Pages/cadastrar", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Verifica ambos os sistemas de autenticação
  const token = await getToken({ req });
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const authToken = (await cookies()).get('auth_token')?.value;


  console.log(`Middleware - Path: ${path} | AuthToken: ${!!authToken} | Session: ${!!session}`);

  // Se estiver em rota protegida e não autenticado
  if (isProtectedRoute && !token && !session?.userId && !authToken) {
    const loginUrl = new URL("/Pages/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Se estiver em rota pública e autenticado
  if (isPublicRoute && (token || session?.userId || authToken)) {
    return NextResponse.redirect(new URL("/Pages/loggedArea", req.nextUrl));
  }

  return NextResponse.next();
}
