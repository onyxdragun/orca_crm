import { pool } from '@/lib/db';

export async function getCustomerByName(name: string) {
  const [firstName, lastName] = name.split('-');
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      'SELECT * FROM customer WHERE first_name = ? AND last_name = ?',
      [firstName, lastName]
    );
    return rows[0] || null;
  } finally {
    conn.release();
  }
}

export async function getTicketsByCustomerId(customerId: number) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      'SELECT * FROM ticket WHERE customer_id = ?',
      [customerId]
    );
    return rows;
  } finally {
    conn.release();
  }
}
