import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      // Use HTTPS issuer (what Keycloak sends in the callback)
      issuer: process.env.KEYCLOAK_ISSUER!,
      // But fetch well-known from internal HTTP
      wellKnown: `${process.env.KEYCLOAK_ISSUER_INTERNAL}/.well-known/openid-configuration`,
      // Override endpoints to use internal HTTP
      authorization: {
        url: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
        params: {
          scope: "openid email profile",
        },
      },
      token: `${process.env.KEYCLOAK_ISSUER_INTERNAL}/protocol/openid-connect/token`,
      userinfo: `${process.env.KEYCLOAK_ISSUER_INTERNAL}/protocol/openid-connect/userinfo`,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.name = profile.name;
        token.email = profile.email;
      }
      return token;
    },
    async session({ session, token }) {
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
