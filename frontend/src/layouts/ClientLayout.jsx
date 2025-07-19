import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function ClientLayout() {
  const username = localStorage.getItem('username') || 'Usuario';
  return (
    <>
      <Header role="client" user={username} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
