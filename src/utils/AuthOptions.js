import { userModel } from "@/models/userModel";
import connectToDb from "@/utils/db";
import bcrypt from "bcrypt";

import GoogleProvider from "next-auth/providers/google";

import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "next-auth/react";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("missing fields!");
        }
        try {
          await connectToDb();
          const user = await userModel.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("user not registered!");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("incorrect password!");
          }
          return user;
        } catch (err) {
          throw new Error(err.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile, account }) {
      if (account?.provider == "google") {
        await connectToDb();
        const exist = await userModel.findOne({ email: user.email });
        if (!exist) {
          const userInfo = await userModel.create({
            email: user.email,
            provider: account.provider,
            image: user.image,
            name: user.name,
          });

          token._id = userInfo._id.toString();
        } else {
          token._id = exist._id.toString();
        }
      } else if (user) {
        token.id = user._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session.id = token.id;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {},
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};
