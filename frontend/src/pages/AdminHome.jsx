import React from 'react';
import {
  FaBox,
  FaClipboardCheck,
  FaClipboardList,
  FaLayerGroup,
} from 'react-icons/fa';
import '../styles/AdminHome.scss';
import { useNavigate } from 'react-router-dom';

const items = [
  { label: 'Actividades', icon: <FaClipboardCheck /> },
  { label: 'Material',    icon: <FaLayerGroup /> },
  { label: 'Productos',   icon: <FaBox /> },
  { label: 'Ordenes',     icon: <FaClipboardList /> },
];

export default function AdminHome() {
  const navigate = useNavigate();
  return (
    <div className="admin-home">
      <div className="button-grid">
        {items.map(({ label, icon }) => (
          <div 
            key={label} 
            className="grid-item"
            onClick={() => {
              if (label === 'Actividades') {
                navigate('/admin-home/activities');
              }
              if (label === 'Material') {
                navigate('/admin-home/materials');
              }
              if (label === 'Productos') {
                navigate('/admin-home/products');
              }
              if (label === 'Ordenes') {
                navigate('/admin-home/orders');
              }
            }}
          >
            <div className="admin-button">
              <div className="icon">{icon}</div>
              <div className="h3">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
