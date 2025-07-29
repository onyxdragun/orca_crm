import { NextResponse } from 'next/server';
import { pool, serializeBigInts } from '@/lib/db';
import { Ticket } from '@/types/ticket';

export async function GET(req: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId: customerIdString } = await params;
  const customerId = Number(customerIdString);

  let conn;
  try {
    conn = await pool.getConnection();
    // Fetch customer and tickets in one go
    const customerRows = await conn.query(
      'SELECT * FROM customer WHERE id = ?',
      [customerId]
    );
    if (!customerRows.length) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    const customer = serializeBigInts(customerRows)[0];
    const ticketRows = await conn.query(
      `SELECT t.*, (
        SELECT COUNT(*) FROM ticket_task tt WHERE tt.ticket_id = t.id
      ) AS task_count
      FROM ticket t WHERE t.customer_id = ?
      ORDER BY t.created_at DESC`,
      [customerId]
    );
    const tickets = serializeBigInts(ticketRows) as Ticket[];
    const ticketCountRows = await conn.query(
      'SELECT COUNT(*) AS ticket_count FROM ticket WHERE customer_id = ?',
      [customerId]
    );
    const [ticketCountRow] = serializeBigInts(ticketCountRows);
    customer.ticket_count = ticketCountRow.ticket_count;
    return NextResponse.json({ customer, tickets });
  } catch (error) {
    console.error('Error fetching customer/tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch customer/tickets' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId: customerIdString } = await params;
  const customerId = Number(customerIdString);
  const body = await req.json();
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM customer WHERE id = ?', [customerId]);
    const customer = rows[0];
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    const {
      first_name,
      last_name,
      email,
      phone_number,
      status,
      unit,
      street,
      city,
      postal_code
    } = body;
    await conn.query(
      `UPDATE customer SET
        first_name = ?,
        last_name = ?,
        email = ?,
        phone_number = ?,
        status = ?,
        unit = ?,
        street = ?,
        city = ?,
        postal_code = ?
      WHERE id = ?`,
      [
        first_name ?? customer.first_name,
        last_name ?? customer.last_name,
        email ?? customer.email,
        phone_number ?? customer.phone_number,
        status ?? customer.status,
        unit ?? customer.unit,
        street ?? customer.street,
        city ?? customer.city,
        postal_code ?? customer.postal_code,
        customerId
      ]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
