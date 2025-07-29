import { NextResponse } from 'next/server';

import { pool } from '@/lib/db';
import { serializeBigInts } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { Customer } from '@/types';

type CustomerRow = Omit<Customer, 'ticket_info' | 'total_tickets'> & {
  total_tickets: number;
  in_progress_tickets: number;
  pending_tickets: number;
  waiting_tickets: number;
  ready_tickets: number;
  closed_tickets: number;
};

export async function GET() {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`
      SELECT c.id, c.first_name, c.last_name, c.email, c.status,
        COUNT(t.id) AS total_tickets,
        SUM(CASE WHEN t.status = 'waiting' THEN 1 ELSE 0 END) AS waiting_tickets,
        SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_tickets,
        SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) AS pending_tickets,
        SUM(CASE WHEN t.status = 'closed' THEN 1 ELSE 0 END) AS closed_tickets,
        SUM(CASE WHEN t.status = 'ready' THEN 1 ELSE 0 END) AS ready_tickets
      FROM customer c
      LEFT JOIN ticket t ON t.customer_id = c.id
      GROUP BY c.id, c.first_name, c.last_name, c.email, c.status
    `);

    // Group ticket info into an object for each customer
    const serialized = serializeBigInts(rows).map((row: CustomerRow) => {
      const { total_tickets, waiting_tickets, in_progress_tickets, pending_tickets, closed_tickets, ready_tickets, ...rest } = row;
      return {
        ...rest,
        total_tickets,
        ticket_info: {
          pending: pending_tickets,
          waiting: waiting_tickets,
          in_progress: in_progress_tickets,
          closed: closed_tickets,
          ready: ready_tickets,
        },
      };
    });
    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}

export async function POST(req: Request) {
  let conn;
  try {
    const data = await req.json();
    const {
      first_name,
      last_name,
      email,
      address = '', // address as a single string
      phone = '',
      status = 'active',
    } = data;

    // Parse address into unit, street, city, postal_code if possible
    let unit = '', street = '', city = '', postal_code = '';
    if (address) {
      // Simple split: unit, street, city, postal_code (comma-separated)
      const parts = address.split(',').map((s: string) => s.trim());
      [unit, street, city, postal_code] = parts;
    }

    conn = await pool.getConnection();
    const result = await conn.query(
      `INSERT INTO customer (first_name, last_name, email, unit, street, city, postal_code, phone_number, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, unit, street, city, postal_code, phone, status]
    );

    // Ensure result.insertId is a number (MariaDB may return BigInt)
    const id = typeof result.insertId === 'bigint' ? Number(result.insertId) : result.insertId;
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
