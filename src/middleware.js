import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  // Get the pathname of the request (e.g. /admin)
  const { pathname } = request.nextUrl;
  
  // Initialize the response
  let response = NextResponse.next();
  
  // Apply caching based on route patterns
  if (pathname.match(/\.(jpe?g|png|gif|svg|webp|ico|woff2?|ttf|eot)$/i)) {
    // Static assets cache for 1 week (604800s)
    response.headers.set('Cache-Control', 'public, max-age=604800, immutable');
  } else if (pathname.startsWith('/api')) {
    // API responses should not be cached by default
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
  } else if (pathname === '/' || pathname === '/about' || pathname === '/contact' || pathname === '/services') {
    // Main marketing pages - cache for 1 hour but validate freshness (3600s)
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
  } else if (pathname.startsWith('/artists') || pathname.startsWith('/releases')) {
    // Content pages - cache for 30 minutes but check for updates (1800s)
    response.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400');
  } else if (!pathname.startsWith('/admin') && !pathname.startsWith('/login')) {
    // Default caching for all other public pages - 10 minutes (600s)
    response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=7200');
  }
  
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
      
      // Admin routes should never be cached
      response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
      
      // Return the response
      return response;
    } catch {
      // If token verification fails, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Return the response with appropriate cache headers
  return response;
}

export const config = {
  // Specify which paths this middleware should run on
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};