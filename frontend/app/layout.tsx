import "./globals.css";
import "../scss/application.bootstrap.scss";

import { AuthUserProvider } from "./context/UserDataContext";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getProvider } from "./Pages/loggedArea/actions";
import { getSessionData } from "./lib/sessions";

export const metadata: Metadata = {
  title: "Marca Modelo",
  description: "Demo da Marca Modelo com visual mais moderno, simples e fluido para apresentação de serviços.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionData();
  let initialUser = null;
  
  if (session) {
    const token = (await cookies()).get('auth_token')?.value;
    if (token) {
      initialUser = await getProvider(token);
    }
  }


  return (
    <html>
      <body>
        <AuthUserProvider initialUser={initialUser}>
          {children}
        </AuthUserProvider>
      </body>
    </html>
  );
}
