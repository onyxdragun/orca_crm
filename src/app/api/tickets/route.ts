import { NextResponse } from 'next/server';
import { pool, serializeBigInts } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status') || '!closed';
  const limit = Number(url.searchParams.get('limit')) || 10;
  let conn;
  try {
    conn = await pool.getConnection();
    let query = 
    `
    SELECT t.*, c.first_name AS customer_first_name, c.last_name AS customer_last_name, CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
      (SELECT COUNT(*) FROM ticket_task tt WHERE tt.ticket_id = t.id) AS task_count
    FROM ticket t
    LEFT JOIN customer c ON t.customer_id = c.id
    `;
    const params: (string | number)[] = [];
    if (status === '!closed') {
      query += ' WHERE t.status != ?';
      params.push('closed');
    } else {
      query += ' WHERE t.status = ?';
      params.push(status);
    }
    query += ' ORDER BY t.created_at DESC LIMIT ?';
    params.push(limit);

    console.log(query);

    const rows = await conn.query(query, params);

    return NextResponse.json(serializeBigInts(rows));
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customer_id,
      subject,
      description,
      priority,
      ticket_number,
      completed_at,
      ticket_type_id
    } = body;
    if (!customer_id || !subject || !priority || !ticket_number || !ticket_type_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const conn = await pool.getConnection();
    const result = await conn.query(
      `INSERT INTO ticket (customer_id, subject, description, priority, ticket_number, status, completed_at, ticket_type_id)
       VALUES (?, ?, ?, ?, ?, 'open', ?, ?)`,
      [customer_id, subject, description, priority, ticket_number, completed_at || null, ticket_type_id]
    );
    conn.release();
    return NextResponse.json({ success: true, id: Number(result.insertId) });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
