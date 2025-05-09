import React from 'react';
import ClientHome from './ClientHome';
import AdminHome from './AdminHome';

export default function Home() {
  const role = localStorage.getItem('role');

  if (!role) return null;

  return role === 'admin' ? <AdminHome /> : <ClientHome />;
}
