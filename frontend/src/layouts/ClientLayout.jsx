import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function ClientLayout() {
  return (
    <>
      <Header role="client" />
      <main>
        <Outlet />
      </main>
    </>
  );
}
