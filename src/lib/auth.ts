import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function requireAuth() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('auth_token');
  if (!cookie) return null;
  try {
    return verify(cookie.value, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}
