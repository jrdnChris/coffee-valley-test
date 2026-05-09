import Head from 'next/head';
import Layout from '@/components/Layout';
import { getSession } from '@/lib/session';
import db from '@/lib/db';

export default function OrderStatusPage({ orders }) {
  return (
    <>
      <Head><title>Coffee Valley - Order Status</title></Head>
      <Layout>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Bean</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Order Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.bean_name}</td>
                  <td>{order.quantity}</td>
                  <td>{order.status}</td>
                  <td>{order.order_date}</td>
                  <td>{order.order_time}</td>
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
    'SELECT order_id, customer_name, bean_name, quantity, status, order_date::text, order_time::text FROM order_status ORDER BY order_date DESC, order_time DESC'
  );

  return { props: { orders: result.rows } };
}
