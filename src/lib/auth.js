import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createOrUpdateUser } from './userService';

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

// Force use NEXTAUTH_URL from environment variable
const nextAuthUrl = process.env.NEXTAUTH_URL;

if (!nextAuthUrl) {
  console.warn('⚠️  NEXTAUTH_URL is not set, using default: http://localhost:3000');
} else {
  console.log('✅ NEXTAUTH_URL is set to:', nextAuthUrl);
}

export const authOptions = {
  // Explicitly set the base URL to ensure it uses NEXTAUTH_URL
  ...(nextAuthUrl && { basePath: undefined }), // Let NextAuth use NEXTAUTH_URL
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
      // Initial sign in - save user data to token and create/update user in database
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image || profile?.picture || profile?.image;

        // Save user to Supabase database on first login
        // This only runs on the initial sign-in, not on token refresh
        if (account.provider === 'google') {
          try {
            const savedUser = await createOrUpdateUser({
              id: user.id,
              email: user.email,
              name: user.name,
              image: token.picture,
            });
            
            if (savedUser) {
              // Store database user ID in token for future reference
              token.dbUserId = savedUser.id;
            }
          } catch (error) {
            console.error('Error saving user to database:', error);
            // Don't block authentication if database save fails
          }
        }
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
