import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force NextAuth to use NEXTAUTH_URL
const nextAuthUrl = process.env.NEXTAUTH_URL;

const handler = NextAuth({
  ...authOptions,
  // Ensure URL is set from environment variable
  ...(nextAuthUrl && {
    url: nextAuthUrl,
  }),
});

export { handler as GET, handler as POST };
