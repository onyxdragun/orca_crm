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
    const rows = await conn.query(
      `SELECT tt.*, t.name AS task_type_name
      FROM ticket_task tt
      LEFT JOIN task_type t ON tt.task_type_id = t.id
      WHERE tt.ticket_id = ? 
      ORDER BY tt.created_at DESC`,
      [ticketId]
    );
    conn.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json([]); // Always return an array, never 404
  }
}

// POST: Add a new task to a ticket
export async function POST
  (req: Request,
    context: { params: Promise<{ ticketId: string }> }
  ) {
  const { ticketId } = await context.params;
  let conn;
  try {
    const body = await req.json();
    const { task_type_id, task_description, status } = body;
    if (!task_description) {
      return NextResponse.json({ error: 'Task description is required' }, { status: 400 });
    }
    conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO ticket_task (ticket_id, task_type_id, task_description, status) VALUES (?, ?, ?, ?)',
      [ticketId, task_type_id || null, task_description, status || 'Not Started']
    );

    return NextResponse.json({ success: true, id: Number(result.insertId) });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
