import NextAuth, { DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { embyClient } from '@/lib/emby'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      embyId: string
      accessToken: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    embyId: string
    accessToken: string
    name: string
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    embyId: string
    accessToken: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Emby',
      credentials: {
        username: { label: 'Benutzername', type: 'text' },
        password: { label: 'Passwort', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const authResponse = await embyClient.authenticateByName(
          credentials.username as string,
          credentials.password as string
        )

        if (!authResponse) {
          return null
        }

        return {
          id: authResponse.User.Id,
          embyId: authResponse.User.Id,
          name: authResponse.User.Name,
          accessToken: authResponse.AccessToken,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.embyId = user.embyId
        token.accessToken = user.accessToken
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.embyId = token.embyId as string
        session.user.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
})
