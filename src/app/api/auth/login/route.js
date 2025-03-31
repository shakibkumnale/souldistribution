import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'shakibkumnale';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'distrosoul143ST';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Check if the credentials match the admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a JWT token with admin flag using jose
      const secretKey = process.env.ADMIN_SECRET_TOKEN || 'fallback_secret_token';
      
      const token = await new SignJWT({ 
        username, 
        isAdmin: true 
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(new TextEncoder().encode(secretKey));

      // Set the token in a secure HTTP-only cookie
      const cookieStore = cookies();
      await cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 1 day in seconds
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    // Return error for invalid credentials
    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}