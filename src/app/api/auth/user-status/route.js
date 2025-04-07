import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore.get('auth-token'))?.value;

    if (!token) {
      return NextResponse.json({ isAuthenticated: false });
    }

    try {
      const secretKey = process.env.ADMIN_SECRET_TOKEN || 'fallback_secret_token';
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secretKey)
      );
      
      return NextResponse.json({
        isAuthenticated: true,
        isAdmin: payload.isAdmin || false,
        username: payload.username
      });
    } catch {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('User status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 