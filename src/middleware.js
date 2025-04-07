import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  // Get the pathname of the request (e.g. /admin)
  const { pathname } = request.nextUrl;
  
  // Check if the pathname starts with /admin
  const isAdminRoute = pathname.startsWith('/admin');
  
  // If it's an admin route, verify the auth token
  if (isAdminRoute) {
    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    // If there's no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      // Verify the token using jose instead of jsonwebtoken (better for Edge runtime)
      const secret = process.env.ADMIN_SECRET_TOKEN || 'fallback_secret_token';
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret)
      );
      
      // Check if the user is an admin
      if (!payload || !payload.isAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      // Check if username matches the expected admin username
      const adminUsername = process.env.ADMIN_USERNAME || 'shakibkumnale';
      if (payload.username !== adminUsername) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      // If everything is ok, allow the request
      return NextResponse.next();
    } catch {
      // If token verification fails, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // For non-admin routes, just proceed
  return NextResponse.next();
}

export const config = {
  // Specify which paths this middleware should run on
  matcher: [
    '/admin/:path*',
  ],
};