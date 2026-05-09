import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getSession } from '@/lib/session';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password }),
    });
    if (res.ok) {
      router.push('/home');
    } else {
      const data = await res.json();
      setError(data.message || 'Login failed.');
    }
  };

  return (
    <>
      <Head><title>Coffee Valley</title></Head>
      <div className="login-page">
        <div className="header-logo">
          <div style={{ border: '5px solid #7c3020', padding: '20px' }}>LOGO</div>
          <div className="header-company">
            <h1>Coffee Valley</h1>
            <p>Taste the love in every cup!</p>
            <p>One Alewife Center 3rd Floor</p>
            <p>Cambridge, MA 02140</p>
          </div>
        </div>

        <br />

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-row">
            <label>User ID:</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label></label>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);
  if (session.user) {
    return { redirect: { destination: '/home', permanent: false } };
  }
  return { props: {} };
}
