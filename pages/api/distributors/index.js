import { getSession } from '@/lib/session';
import db from '@/lib/db';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  if (!session.user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'GET') {
    const result = await db.query('SELECT * FROM distributor ORDER BY distributor_name');
    return res.status(200).json(result.rows);
  }

  if (req.method === 'POST') {
    const { distributor_name, city, state_region, country, phone, email } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO distributor (distributor_name, city, state_region, country, phone, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [distributor_name, city, state_region, country, phone, email]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to add distributor.' });
    }
  }

  return res.status(405).end();
}
