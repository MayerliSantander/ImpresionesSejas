import React, { useEffect, useState } from 'react';
import ClientHome from './ClientHome';
import AdminHome from './AdminHome';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');

    if (!storedRole) {
      navigate('/', { replace: true });
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  if (!role) return null;

  return role === 'admin' ? <AdminHome /> : <ClientHome />;
}
