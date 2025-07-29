import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  if (!date) {
    return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 });
  }
  try {
    const conn = await pool.getConnection();
    // Match tickets created on the given date (YYYYMMDD)
    const rows = await conn.query(
      `SELECT COUNT(*) as count FROM ticket WHERE DATE_FORMAT(created_at, '%Y%m%d') = ?`,
      [date]
    );
    conn.release();
    return NextResponse.json({ count: rows[0]?.count || 0 });
  } catch (error) {
    console.error('Error counting tickets:', error);
    return NextResponse.json({ error: 'Failed to count tickets' }, { status: 500 });
  }
}
