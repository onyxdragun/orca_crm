import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  const conn = await pool.getConnection();
  const rows = await conn.query('SELECT id, name FROM device_type ORDER BY name ASC');
  conn.release();
  return NextResponse.json(rows);
}
