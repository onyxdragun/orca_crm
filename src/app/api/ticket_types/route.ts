import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT id, name, description FROM ticket_type ORDER BY name ASC');
    conn.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket types' }, { status: 500 });
  }
}
