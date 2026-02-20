import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Admin routes protection
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (req.nextauth.token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Public routes - no auth needed
        const publicPaths = [
          '/',  // Landing page is public
          '/api/auth', 
          // SEC-1 & SEC-2: Removed /api/seed and /api/migrate from public paths
          '/_next', 
          '/favicon.ico',
          '/privacy',
          '/terms'
        ];
        
        // Check if current path is public
        const isPublic = publicPaths.some(path => 
          req.nextUrl.pathname === path || 
          req.nextUrl.pathname.startsWith(path + '/')
        );
        
        if (isPublic) {
          return true;
        }
        
        // All other routes require authentication
        return token !== null;
      }
    }
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)']
};
