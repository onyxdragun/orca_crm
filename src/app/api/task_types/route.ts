import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT id, name, description FROM task_type ORDER BY name ASC');
    conn.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching task types:', error);
    return NextResponse.json({ error: 'Failed to fetch task types' }, { status: 500 });
  }
}
