import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'

async function refreshAccessToken(token: Record<string, unknown>) {
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw data
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken,
    }
  } catch {
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/drive',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000
      }
      if (user) token.id = user.id
      // Return token if not expired yet
      if (Date.now() < (token.accessTokenExpires as number ?? 0)) return token
      // Refresh if expired
      return refreshAccessToken(token as Record<string, unknown>)
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
