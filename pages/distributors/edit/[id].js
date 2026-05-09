import Head from 'next/head';
import Layout from '@/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from '@/lib/session';
import db from '@/lib/db';

const COUNTRIES = [
  'Indonesia', 'Malaysia', 'Thailand', 'Vietnam'
];

export default function EditDistributorPage({ distributor }) {
  const router = useRouter();
  const [form, setForm] = useState(distributor);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/distributors/${distributor.distributor_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/distributors');
    } else {
      const data = await res.json();
      setError(data.message || 'Failed to update distributor.');
    }
  };

  return (
    <>
      <Head><title>Coffee Valley - Edit Distributor</title></Head>
      <Layout>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Distributor Name</label>
            <input type="text" name="distributor_name" value={form.distributor_name} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>City</label>
            <input type="text" name="city" value={form.city || ''} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>State/Region</label>
            <input type="text" name="state_region" value={form.state_region || ''} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Country</label>
            <select name="country" value={form.country || ''} onChange={handleChange}>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Phone</label>
            <input type="text" name="phone" value={form.phone || ''} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input type="text" name="email" value={form.email || ''} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label></label>
            <button type="submit">Update</button>
          </div>
        </form>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res, params }) {
  const session = await getSession(req, res);
  if (!session.user) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const result = await db.query(
    'SELECT * FROM distributor WHERE distributor_id = $1',
    [params.id]
  );

  if (result.rows.length === 0) return { notFound: true };

  return { props: { distributor: result.rows[0] } };
}
