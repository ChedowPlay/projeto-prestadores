/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextAuthOptions } from "next-auth";

export const authConfig: NextAuthOptions = {
  providers: [], // Configure seus providers separadamente
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/Pages/login'
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 60 * 60 // 3 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        // Você precisa fazer um type assertion aqui para a versão 4
        (session.user as any).id = token.id;
      }
      return session;
    }
  }
};
