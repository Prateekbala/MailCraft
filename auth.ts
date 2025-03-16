import NextAuth, { Account } from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/app/db/prisma";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
      },
      async authorize(credentials: any) {
        const { email } = credentials;

        if (!email) {
          throw new Error("Email is required");
        }

        let user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              email,
              isVerified: false,
            },
          });
        }
        return {
          id: user.id,
          email: user.email,
          isVerified: user.isVerified,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (
        account &&
        (account.provider === "google" || account.provider === "github")
      ) {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email as string },
          });

          if (existingUser) {
            if (!existingUser.isVerified) {
              await db.user.update({
                where: { email: user.email as string },
                data: { isVerified: true },
              });
            }
            user.id = existingUser.id;
          } else {
            const newUser = await db.user.create({
              data: {
                email: user.email as string,
                isVerified: true,
              },
            });
            user.id = newUser.id;
          }
        } catch (error) {
          console.error("Error saving user to database:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        // Store the database ID in the token
        token.id = user.id;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        // Pass the database ID from token to session
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
});
