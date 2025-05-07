import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    const cookieStore = cookies();
    const tokenCookie = await cookieStore.get('auth-token');
    const token = tokenCookie?.value;

    if (!token) {
      return NextResponse.json(
        { isAdmin: false, error: 'No authentication token' },
        { status: 401 }
      );
    }

    // Verify the token
    try {
      const secretKey = process.env.ADMIN_SECRET_TOKEN || 'fallback_secret_token';
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secretKey)
      );

      // Check if the token contains isAdmin flag
      if (payload && payload.isAdmin) {
        return NextResponse.json({ isAdmin: true, username: payload.username });
      } else {
        return NextResponse.json(
          { isAdmin: false, error: 'Not authorized as admin' },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { isAdmin: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 