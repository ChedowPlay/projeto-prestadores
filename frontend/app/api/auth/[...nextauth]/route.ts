import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const handler = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
});

export { handler as GET, handler as POST };
