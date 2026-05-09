import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div>
      <div className="header">
        <div className="header-logo">
          <div style={{ border: '5px solid #7c3020', padding: '20px' }}>LOGO</div>
          <div className="header-company">
            <h1>Coffee Valley</h1>
            <p>Taste the love in every cup!</p>
            <p>One Alewife Center 3rd Floor</p>
            <p>Cambridge, MA 02140</p>
          </div>
        </div>
      </div>
      <nav className="navbar">
        <Link href="/home">Home</Link>
        <Link href="/catalogue">Catalog</Link>
        <Link href="/order-status">Order Status</Link>
        <Link href="/distributors">Distributors</Link>
        <Link href="/upload">Upload</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </div>
  );
}
