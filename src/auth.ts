import NextAuth, { type DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
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
  secret: process.env.AUTH_SECRET || "codigo_apparel_production_secret_key_2024_secure_v5",
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Admin Portal",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const adminUsername = process.env.ADMIN_USERNAME || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "decode777";

        if (credentials.username === adminUsername && credentials.password === adminPassword) {
          return {
            id: "admin-user",
            name: "Admin",
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
      const isDashboard = nextUrl.pathname.startsWith("/admin");

      // If trying to access admin dashboard, require login
      if (isDashboard) {
        return isLoggedIn;
      }

      return true; // Everything else is public
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
