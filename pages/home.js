import Head from 'next/head';
import Layout from '@/components/Layout';
import { getSession } from '@/lib/session';
import db from '@/lib/db';

export default function HomePage({ bean }) {
  return (
    <>
      <Head><title>Coffee Valley - Home</title></Head>
      <Layout>
        {bean ? (
          <div style={{ paddingLeft: '20%', paddingRight: '20%' }}>
            <p><strong>Bean of the Day</strong></p>
            <p>{bean.bean_name}</p>
            <br />
            <p><strong>Sale Price</strong></p>
            <p>${parseFloat(bean.sale_price).toFixed(2)}</p>
            <br />
            <p><strong>Description</strong></p>
            <p>{bean.description}</p>
            <br />
            <p style={{ textAlign: 'center' }}>{bean.date}</p>
          </div>
        ) : (
          <p>No bean of the day available.</p>
        )}
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);
  if (!session.user) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const result = await db.query(`
    SELECT b.bean_name, b.description, d.sale_price, d.date
    FROM beans b
    JOIN dailybean d ON b.bean_id = d.bean_id
    WHERE d.sale_price >= 0
    ORDER BY d.date DESC
    LIMIT 1
  `);

  const row = result.rows[0];
  const bean = row
    ? {
        bean_name: row.bean_name,
        description: row.description,
        sale_price: row.sale_price.toString(),
        date: row.date.toISOString().split('T')[0],
      }
    : null;

  return { props: { bean } };
}
