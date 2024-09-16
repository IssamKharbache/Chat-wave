import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "@/lib/connectToDb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export const authOptions = {
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
      if (account?.provider == "credentials") {
        return true;
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
            return true;
          }
          return true;
        } catch (error) {
          console.log("Error while saving user while OAuth", error);
        }
      }
    },
  },
  async session({ session, token }) {
    console.log(token);
    //setting up session data from database
    session.user.id = token.id;
    session.user.name = token.username;
    session.user.email = token.email;
    return session;
  },

  async jwt({ token, user, account }) {
    if (user) {
      token.id = user.id;
      token.username = user.name;
      token.email = user.email;
      token.provider = account.provider;
    }
    return token;
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in", //redirect to sign in page
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
