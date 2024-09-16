import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "@/lib/connectToDb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await connectToDb();
          const user = await User.findOne({ email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const loggedInUser = {
        username: user.name,
        email: user.email,
        userId: user._id,
      };
      if (account?.provider == "credentials") {
        return loggedInUser;
      }
      if (account?.provider == "google") {
        await connectToDb();
        try {
          const existingUser = await User.findOne({ email: user.email });
          const hashPassword = await bcrypt.hash(uuidv4(), 10);
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              username: user.name,
              password: hashPassword,
            });
            await newUser.save();
            return loggedInUser;
          }
          return loggedInUser;
        } catch (error) {
          console.log("Error while saving user while OAuth", error);
        }
      }
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.username;
        token.email = user.email;
      }
      return token;
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
