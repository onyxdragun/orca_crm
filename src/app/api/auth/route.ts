import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

const USER_NAME = process.env.USER_NAME;
const USER_HASH = process.env.USER_HASH_BASE64
  ? Buffer.from(process.env.USER_HASH_BASE64, 'base64').toString('utf-8')
  : process.env.USER_HASH;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
  }

  if (username !== USER_NAME) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, USER_HASH || '');
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
  // Set JWT as HTTP-only cookie using Set-Cookie header
  const cookie = serialize('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Set-Cookie': cookie,
      'Content-Type': 'application/json',
    },
  });
}
