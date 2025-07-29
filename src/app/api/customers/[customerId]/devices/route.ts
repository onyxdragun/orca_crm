import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId: customerIdString } = await params;
  const customerId = Number(customerIdString);

  const conn = await pool.getConnection();
  const rows = await conn.query(
    `SELECT d.*, t.name AS device_type_name
    FROM customer_device d
    LEFT JOIN device_type t ON d.device_type_id = t.id
    WHERE d.customer_id = ?`,
    [customerId]
  );
  conn.release();
  return NextResponse.json(rows);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId: customerIdString } = await params;
  const customerId = Number(customerIdString);
  const body = await req.json();
  const conn = await pool.getConnection();
  const firstServiceDate = body.first_service_date || null;
  const lastServiceDate = body.last_service_date || null;
  await conn.query(
    `INSERT INTO customer_device (customer_id, device_type_id, brand_model, serial_number, first_service_date, last_service_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [customerId, body.device_type_id, body.brand_model, body.serial_number, firstServiceDate, lastServiceDate, body.notes]
  );
  conn.release();
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId: customerIdString } = await params;
  const customerId = Number(customerIdString);

  const body = await req.json();
  const conn = await pool.getConnection();
  // Expect device_id in body to identify which device to update
  const deviceId = body.device_id;
  if (!deviceId) {
    conn.release();
    return NextResponse.json({ error: 'Missing device_id' }, { status: 400 });
  }
  await conn.query(
    `UPDATE customer_device SET
      device_type_id = ?,
      brand_model = ?,
      serial_number = ?,
      first_service_date = ?,
      last_service_date = ?,
      notes = ?
    WHERE id = ? AND customer_id = ?`,
    [
      body.device_type_id,
      body.brand_model,
      body.serial_number,
      body.first_service_date || null,
      body.last_service_date || null,
      body.notes,
      deviceId,
      customerId
    ]
  );
  conn.release();
  return NextResponse.json({ success: true });
}
