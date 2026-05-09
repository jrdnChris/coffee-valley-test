import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { getSession } from '@/lib/session';
import db from '@/lib/db';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const session = await getSession(req, res);
  if (!session.user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method !== 'POST') return res.status(405).end();

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  try {
    const [fields, files] = await form.parse(req);

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const author = Array.isArray(fields.author) ? fields.author[0] : fields.author;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded.' });

    const fileName = path.basename(file.filepath);

    const result = await db.query(
      'INSERT INTO upload (title, document_file, author) VALUES ($1, $2, $3) RETURNING *',
      [title, fileName, author || '']
    );

    return res.status(201).json({ document: result.rows[0] });
  } catch (err) {
    console.error(err);
    if (err.code === 1009) {
      return res.status(400).json({ message: 'File exceeds the 10MB size limit.' });
    }
    return res.status(500).json({ message: 'Upload failed.' });
  }
}
