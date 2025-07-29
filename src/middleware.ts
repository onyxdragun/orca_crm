import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const protectedRoutes = [
  '/customers',
  '/api/customers',
  '/tickets',
  '/api/tickets',
  '/devices',
  '/api/devices',
  '/customer',
  '/api/customer',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )) {
    console.log('Route is protected:', pathname);
    const token = request.cookies.get('auth_token')?.value;
    console.log('Token found:', !!token);
    
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    try {
      // Convert string secret to Uint8Array for jose
      const secret = new TextEncoder().encode(JWT_SECRET);
      
      // Verify the JWT using jose
      const { payload } = await jwtVerify(token, secret);
      
      console.log('✅ Token valid for:', pathname);
      console.log('Token payload:', payload);
      
    } catch (error) {
      // Redirect to login with error message
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.log('❌ Invalid token, deleting cookie:', errorMsg);
      console.log('JWT_TOKEN starts with: ', token?.substring(0, 20));
      
      // Create response and delete the invalid cookie
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }
  
  return NextResponse.next();
}

// Config matcher for better performance - only runs on specified routes
export const config = {
  matcher: [
    '/customers/:path*',
    '/api/customers/:path*',
    '/tickets/:path*',
    '/api/tickets/:path*',
    '/devices/:path*',
    '/api/devices/:path*',
    '/customer/:path*',
    '/api/customer/:path*',
  ]
};