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
  // Use environment secret, but HAVE A HARDCODED FALLBACK so it NEVER fails with 'Configuration' error
  secret: process.env.AUTH_SECRET || "codigo_apparel_production_secret_key_2024_secure_v5",
  trustHost: true,
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Auth attempt for:", credentials?.username);

        if (!credentials?.username || !credentials?.password) return null;

        const adminUsername = process.env.ADMIN_USERNAME || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "adminside123";

        if (credentials.username === adminUsername && credentials.password === adminPassword) {
          console.log("Auth successful for admin");
          return {
            id: "admin-id",
            name: "Admin User",
            email: "admin@codigo.com",
            role: "admin"
          };
        }

        console.log("Auth failed: Invalid credentials");
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
});
