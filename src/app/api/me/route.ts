import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = parse(cookieHeader);
  const token = cookies.auth_token;
  if (!token) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ loggedIn: true, user: payload });
  } catch {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }
}
