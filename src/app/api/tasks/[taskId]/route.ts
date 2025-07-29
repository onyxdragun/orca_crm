import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// DELETE: Remove a task by ID
export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('DELETE FROM ticket_task WHERE id = ?', [taskId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}

// PUT: Update a task (edit fields)
export async function PUT(
  req: Request,
  context: { params: Promise<{ taskId: string }> })
  {
  const { taskId } = await context.params;
  let conn;
  try {
    const body = await req.json();
    const { task_description, task_type_id, minutes, status, notes } = body;
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }
    conn = await pool.getConnection();
    let query = 'UPDATE ticket_task SET ';
    let params = [];
    if (typeof minutes !== 'undefined' && status === 'Completed') {
      query += 'minutes = ?, status = ?, completed_at = CURRENT_TIMESTAMP';
      if (typeof notes !== 'undefined') {
        query += ', notes = ?';
        params = [minutes || 0, status, notes];
      } else {
        params = [minutes || 0, status];
      }
    } else {
      query += 'task_description = ?, task_type_id = ?, minutes = ?, status = ?';
      params = [task_description || '', task_type_id || null, minutes || 0, status];
      if (typeof notes !== 'undefined') {
        query += ', notes = ?';
        params.push(notes);
      }
      if (status === 'Completed') {
        query += ', completed_at = CURRENT_TIMESTAMP';
      }
    }
    query += ' WHERE id = ?';
    params.push(taskId);
    await conn.query(query, params);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
