import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ equipment_id: string }> }
) {
  const { equipment_id } = await params;
  const equipment_id_num = Number(equipment_id);
  const body = await req.json();
  
  const conn = await pool.getConnection();
  await conn.query(
    `UPDATE customer_device SET device_type_id=?, brand_model=?, serial_number=?, first_service_date=?, last_service_date=?, notes=?, custody_status=? WHERE equipment_id=?`,
    [body.device_type_id, body.brand_model, body.serial_number, body.first_service_date, body.last_service_date, body.notes, body.custody_status, equipment_id_num]
  );
  conn.release();
  
  return NextResponse.json({ success: true });
}