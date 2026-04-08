import NextAuth, { type DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

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
  secret: process.env.AUTH_SECRET || "codigo_apparel_production_secret_key_2024_secure_v5",
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
        const adminUsername = process.env.ADMIN_USERNAME || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "decode777";

        if (identifier === adminUsername && password === adminPassword) {
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
      if (user) {
        token.role = user.role;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string;
        session.user.id = token.sub as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
});
