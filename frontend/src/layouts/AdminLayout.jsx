import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function AdminLayout() {
  const username = localStorage.getItem('username') || 'Administrador';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header role="admin" user={username}/>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  );
}
