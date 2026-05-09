import { getSession } from '@/lib/session';

export default function IndexPage() {
  return null;
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);
  if (session.user) {
    return { redirect: { destination: '/home', permanent: false } };
  }
  return { redirect: { destination: '/login', permanent: false } };
}
