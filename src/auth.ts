import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the session and user types for the 'role' field
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
  // Use session strategy for Credentials provider
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

        // Admin check logic
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
      const isAdmin = auth?.user?.role === "admin";
      const isDashboard = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/login";

      // If trying to access admin dashboard
      if (isDashboard) {
        if (isLoggedIn && isAdmin) return true; // Let them in
        return false; // Redirect to login
      }

      // If trying to access login page while already logged in as admin
      if (isLoginPage && isLoggedIn && isAdmin) {
        return Response.redirect(new URL("/admin", nextUrl));
      }

      return true; // Let them through for all other pages
    },
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
    signIn: "/login"
  }
});
