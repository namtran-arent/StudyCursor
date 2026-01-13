import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('⚠️  GOOGLE_CLIENT_ID is not set in environment variables');
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.error('⚠️  GOOGLE_CLIENT_SECRET is not set in environment variables');
}

if (!process.env.NEXTAUTH_SECRET) {
  console.error('⚠️  NEXTAUTH_SECRET is not set in environment variables');
  console.error('   Generate one using: openssl rand -base64 32');
}

if (!process.env.NEXTAUTH_URL) {
  console.warn('⚠️  NEXTAUTH_URL is not set, using default: http://localhost:3000');
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.sub;
        // Ensure image is preserved from token
        if (token.picture) {
          session.user.image = token.picture;
        }
        // Ensure name and email are preserved
        if (token.name) {
          session.user.name = token.name;
        }
        if (token.email) {
          session.user.email = token.email;
        }
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // Initial sign in - save user data to token
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image || profile?.picture || profile?.image;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
