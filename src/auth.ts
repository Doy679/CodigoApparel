import NextAuth, { type DefaultSession } from "next-auth";
import type { JWT as AuthJwt } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const isProduction = process.env.NODE_ENV === "production";
const developmentAuthSecret = "dev-only-codigo-auth-secret-change-before-deploy";
const authSecret = process.env.AUTH_SECRET || (isProduction ? undefined : developmentAuthSecret);
type CodigoJwt = AuthJwt & { role?: string };

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      id?: string;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: authSecret,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        username: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const identifier = credentials.username as string;
        const password = credentials.password as string;

        // 1. Check Admin Hardcoded Credentials First
        const adminUsername = process.env.ADMIN_USERNAME || (isProduction ? undefined : "admin");
        const adminPassword =
          process.env.ADMIN_PASSWORD || (isProduction ? undefined : "decode777");

        if (
          adminUsername &&
          adminPassword &&
          identifier === adminUsername &&
          password === adminPassword
        ) {
          return {
            id: "admin-user",
            name: "Admin",
            email: "admin@codigo.com",
            role: "admin"
          };
        }

        // 2. Check Database for Customer (assuming identifier is email)
        const user = await db.user.findUnique({
          where: { email: identifier }
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/admin");
      const isAccount = nextUrl.pathname.startsWith("/account");

      // Admin routes require admin role
      if (isDashboard) {
        return isLoggedIn && auth?.user?.role === "admin";
      }

      // Account routes require any logged in user
      if (isAccount) {
        return isLoggedIn;
      }

      return true; // Everything else is public
    },
    async jwt({ token, user }) {
      const codigoToken = token as CodigoJwt;
      if (user) {
        codigoToken.role = user.role;
        codigoToken.sub = user.id;
      }
      return codigoToken;
    },
    async session({ session, token }) {
      const codigoToken = token as CodigoJwt;
      if (session.user && codigoToken.role) {
        session.user.role = codigoToken.role;
        session.user.id = codigoToken.sub as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
});
