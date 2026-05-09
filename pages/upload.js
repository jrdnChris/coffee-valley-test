import Head from 'next/head';
import Layout from '@/components/Layout';
import { useState } from 'react';
import { getSession } from '@/lib/session';
import db from '@/lib/db';

export default function UploadPage({ initialDocuments }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [docs, setDocs] = useState(initialDocuments);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('author', author);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });

    if (res.ok) {
      const data = await res.json();
      setDocs([data.document, ...docs]);
      setTitle('');
      setFile(null);
      setAuthor('');
      setMessage('Document added successfully.');
    } else {
      const data = await res.json();
      setMessage(data.message || 'Upload failed.');
    }
  };

  return (
    <>
      <Head><title>Coffee Valley - Upload</title></Head>
      <Layout>
        <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Document File</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
          </div>
          <div className="form-row">
            <label>Author</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="form-row">
            <label></label>
            <button type="submit">Add Document</button>
          </div>
        </form>
        </div>

        <br />
        {message && <p style={{ textAlign: 'center' }}>{message}</p>}
        <br />

        {docs.length === 0 ? (
          <p style={{ textAlign: 'center' }}>There are currently no reports in the library.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.upload_id}>
                  <td>{doc.title}</td>
                  <td>{doc.author}</td>
                  <td>
                    <a href={`/uploads/${doc.document_file}`} target="_blank" rel="noreferrer">
                      {doc.document_file}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

  const result = await db.query(
    'SELECT upload_id, title, document_file, author FROM upload ORDER BY uploaded_at DESC'
  );

  return { props: { initialDocuments: result.rows } };
}
