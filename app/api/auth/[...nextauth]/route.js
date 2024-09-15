import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "@/lib/connectToDb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await connectToDb();
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );
          if (!isPasswordCorrect) {
            return null;
          }
          return user;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
