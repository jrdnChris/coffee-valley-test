import Head from 'next/head';
import Layout from '@/components/Layout';
import { getSession } from '@/lib/session';
import db from '@/lib/db';

export default function CataloguePage({ beans }) {
  return (
    <>
      <Head><title>Coffee Valley - Catalog</title></Head>
      <Layout>
        <table className="data-table">
          <thead>
            <tr>
              <th>Bean</th>
              <th>Description</th>
              <th>Price/Unit</th>
            </tr>
          </thead>
          <tbody>
            {beans.map((bean) => (
              <tr key={bean.bean_id}>
                <td style={{ verticalAlign: 'top', whiteSpace: 'nowrap' }}>{bean.bean_name}</td>
                <td>{bean.description}</td>
                <td style={{ verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                  ${parseFloat(bean.price_per_unit).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);
  if (!session.user) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const result = await db.query(
    'SELECT bean_id, bean_name, description, price_per_unit FROM beans ORDER BY bean_name'
  );

  const beans = result.rows.map((b) => ({
    ...b,
    price_per_unit: b.price_per_unit ? b.price_per_unit.toString() : '0.00',
  }));

  return { props: { beans } };
}
