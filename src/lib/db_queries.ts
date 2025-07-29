import { pool } from './db';

export async function getDevicesByCustomerId(customerId: number) {
  const conn = await pool.getConnection();
  const devices = await conn.query(
    `SELECT d.*, t.name AS device_type_name FROM customer_device d LEFT JOIN device_type t ON d.device_type_id = t.id WHERE d.customer_id = ?`,
    [customerId]
  );
  conn.release();
  return devices;
}

export async function getCustomerIdByName(firstName: string, lastName: string) {
  const conn = await pool.getConnection();
  const rows = await conn.query(
    'SELECT id FROM customer WHERE first_name = ? AND last_name = ?',
    [firstName, lastName]
  );
  conn.release();
  return rows[0]?.id || null;
}
