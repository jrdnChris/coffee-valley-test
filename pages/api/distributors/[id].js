import { getSession } from '@/lib/session';
import db from '@/lib/db';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  if (!session.user) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { distributor_name, city, state_region, country, phone, email } = req.body;
    const result = await db.query(
      `UPDATE distributor
       SET distributor_name=$1, city=$2, state_region=$3, country=$4, phone=$5, email=$6
       WHERE distributor_id=$7
       RETURNING *`,
      [distributor_name, city, state_region, country, phone, email, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(result.rows[0]);
  }

  return res.status(405).end();
}
