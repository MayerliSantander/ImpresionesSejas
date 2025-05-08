import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function AdminLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
