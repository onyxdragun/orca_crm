import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the auth_token cookie
  return NextResponse.json({ success: true }, {
    status: 200,
    headers: {
      'Set-Cookie': 'auth_token=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict',
    },
  });
}
