import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24h
  },

  providers: [
    // ---------------- GOOGLE ----------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ---------------- CREDENTIALS ----------------
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select(
          "+password",
        );

        if (!user) throw new Error("INVALID_CREDENTIALS");

        if (user.status !== "active") throw new Error("ACCOUNT_NOT_ACTIVE");

        const valid = await bcrypt.compare(credentials.password, user.password);

        if (!valid) throw new Error("INVALID_CREDENTIALS");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],

  callbacks: {
    // ---------------- SIGN IN ----------------
    async signIn({ user, account }) {
      await connectDB();

      if (account.provider === "credentials") return true;

      // GOOGLE LOGIN
      const email = user.email;
      if (!email) return false;

      let dbUser = await User.findOne({ email });

      if (!dbUser) {
        dbUser = await User.create({
          name: user.name || "New User",
          email,
          avatar: user.image,
          role: "student",
          status: "active",
          bio: "",
          authProviders: [
            {
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          ],
          lastLogin: new Date(),
        });
      } else {
        if (dbUser.status !== "active") throw new Error("ACCOUNT_NOT_ACTIVE");

        dbUser.lastLogin = new Date();
        await dbUser.save();
      }

      user.id = dbUser._id.toString();
      return true;
    },

    // ---------------- JWT (ALWAYS SYNC FROM DB) ----------------
    async jwt({ token, user }) {
      // First login
      if (user) {
        token.id = user.id;
      }

      // 🔥 ALWAYS fetch fresh data from DB
      if (token.id) {
        await connectDB();

        const dbUser = await User.findById(token.id);

        if (!dbUser) {
          token.status = "deleted";
          return token;
        }

        token.role = dbUser.role;
        token.status = dbUser.status;
        token.bio = dbUser.bio;
        token.avatar = dbUser.avatar;
        token.name = dbUser.name;
      }

      return token;
    },

    // ---------------- SESSION ----------------
    async session({ session, token }) {
      if (!session.user) return session;

      session.user.id = token.id;
      session.user.role = token.role;
      session.user.status = token.status;
      session.user.bio = token.bio;
      session.user.image = token.avatar;
      session.user.name = token.name;

      // 🔥 AUTO INVALIDATE BLOCKED USERS
      if (token.status !== "active") {
        return null;
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
