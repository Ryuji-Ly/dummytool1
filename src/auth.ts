import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER_INTERNAL || process.env.KEYCLOAK_ISSUER!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
        url: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
      },
      token: `${process.env.KEYCLOAK_ISSUER_INTERNAL || process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
      userinfo: `${process.env.KEYCLOAK_ISSUER_INTERNAL || process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Add user info to token on initial sign in
      if (account && profile) {
        token.accessToken = account.access_token;
        token.name = profile.name;
        token.email = profile.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user info to session
      if (token) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  trustHost: true,
});