import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET: List all tasks for a ticket
export async function GET(
  req: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM ticket_task WHERE ticket_id = ? ORDER BY created_at ASC', [ticketId]);
    conn.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching taskss:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST: Add a new task to a ticket
export async function POST(
  req: Request,
  { params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;
  try {
    const body = await req.json();
    const { description, hours } = body;
    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO ticket_task (ticket_id, description, hours) VALUES (?, ?, ?)',
      [ticketId, description, hours || 0]
    );
    conn.release();
    return NextResponse.json({ success: true, id: Number(result.insertId) });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
