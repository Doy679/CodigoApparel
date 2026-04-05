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
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development", // Set true to see detailed logs in your live server console
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? `__Secure-authjs.session-token`
          : `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    }
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
          console.error("ADMIN_PASSWORD not set in environment variables");
          return null;
        }

        if (credentials.username === adminUsername && credentials.password === adminPassword) {
          // IMPORTANT: Return a full object that NextAuth likes.
          return {
            id: "admin-1",
            name: "Admin",
            email: "admin@codigo.com",
            role: "admin"
          };
        }

        console.log("Login failed for username:", credentials.username);
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
});
