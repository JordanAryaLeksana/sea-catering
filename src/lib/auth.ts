import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
// import { User } from "@prisma/client";



export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("User not found or no password set");
                }

                // Blokir user biasa pakai email admin
                const adminEmail = process.env.ADMIN_EMAIL;
                if (
                    credentials.email === adminEmail &&
                    user.role.toLowerCase() !== "admin"
                ) {
                    throw new Error("Only admin can use this email");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            const adminEmail = process.env.ADMIN_EMAIL;

            // Prevent admin login via Google
            if (account?.provider === "google" && user?.email === adminEmail) {
                throw new Error("Admin must login using credentials only");
            }

            if (account && user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.role = (user).role?.toLowerCase() || "user";
                token.picture = user.image ?? null;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.role = token.role as string;
                session.user.image = token.picture as string | null;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

