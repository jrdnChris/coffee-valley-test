import { getSession } from '@/lib/session';
import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, password } = req.body;

  const result = await db.query(
    'SELECT * FROM logins WHERE user_id = $1 AND password = $2',
    [userId, password]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: 'Invalid user ID or password.' });
  }

  const session = await getSession(req, res);
  session.user = { id: userId };
  await session.save();

  // console.log(`[login] ${userId} signed in`);
  return res.status(200).json({ ok: true });
}
