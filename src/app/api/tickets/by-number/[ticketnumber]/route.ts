import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(
  req: Request,
  context: {params: Promise<{ ticketnumber: string }>}
) {
  const {ticketnumber} = await context.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT t.*, tt.name AS ticket_type_name, d.brand_model AS device_brand_model, d.serial_number AS device_serial_number, d.device_type_id, dt.name AS device_type_name, d.notes AS notes
      FROM ticket t
      LEFT JOIN ticket_type tt ON t.ticket_type_id = tt.id
      LEFT JOIN customer_device d ON t.device_id = d.equipment_id
      LEFT JOIN device_type dt ON d.device_type_id = dt.id
      WHERE t.ticket_number = ?
    `, [ticketnumber]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching ticket by number:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ ticketnumber: string }> }
) {
  const { ticketnumber } = await params;
  let conn;
  try {
    const body = await req.json();
    const { subject, status, due_at, description, ticket_type_id, device_id, priority } = body;
    conn = await pool.getConnection();
    await conn.query(
      `UPDATE ticket SET subject = ?, status = ?, due_at = ?, description = ?, ticket_type_id = ?, device_id = ?, priority = ? WHERE ticket_number = ?`,
      [subject, status, due_at || null, description, ticket_type_id || null, device_id || null, priority, ticketnumber]
    );
    const [updated] = await conn.query(`
      SELECT t.*, tt.name AS ticket_type_name, d.brand_model AS device_brand_model, d.serial_number AS device_serial_number, d.device_type_id, dt.name AS device_type_name, d.notes AS notes
      FROM ticket t
      LEFT JOIN ticket_type tt ON t.ticket_type_id = tt.id
      LEFT JOIN customer_device d ON t.device_id = d.equipment_id
      LEFT JOIN device_type dt ON d.device_type_id = dt.id
      WHERE t.ticket_number = ?
    `, [ticketnumber]);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
