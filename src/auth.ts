import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
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
  debug: true, // This will show us EXACTLY what is wrong in the logs
  secret: process.env.AUTH_SECRET || "codigo_apparel_production_secret_key_2024_secure_v5",
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const u = credentials?.username as string;
        const p = credentials?.password as string;

        // Hardcoded for 100% stability during fix
        if (u === "admin" && p === "adminside123") {
          return {
            id: "admin-id",
            name: "Admin User",
            email: "admin@codigo.com",
            role: "admin"
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === "admin";
      const isDashboard = nextUrl.pathname.startsWith("/admin");

      if (isDashboard) {
        if (isLoggedIn && isAdmin) return true;
        return false; // Redirects to login automatically
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
});
