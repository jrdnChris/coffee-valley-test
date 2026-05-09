import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getSession } from '@/lib/session';
import db from '@/lib/db';

export default function DistributorsPage({ distributors }) {
  return (
    <>
      <Head><title>Coffee Valley - Distributors</title></Head>
      <Layout>
        <table className="data-table">
          <thead>
            <tr>
              <th>Distributor Name</th>
              <th>City</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {distributors.map((d) => (
              <tr key={d.distributor_id}>
                <td>{d.distributor_name}</td>
                <td>{d.city}</td>
                <td>
                  <Link href={`/distributors/edit/${d.distributor_id}`} className="edit-link">
                    [Edit]
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'center' }}>
          <Link href="/distributors/add" className="add-link">[Add]</Link>
        </div>
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
    'SELECT distributor_id, distributor_name, city FROM distributor ORDER BY distributor_name'
  );

  return { props: { distributors: result.rows } };
}
