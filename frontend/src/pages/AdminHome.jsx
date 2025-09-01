import {
  FaBox,
  FaClipboardCheck,
  FaClipboardList,
  FaFileWord,
  FaLayerGroup,
} from 'react-icons/fa';
import { BiSolidReport } from "react-icons/bi";
import '../styles/AdminHome.scss';
import { useNavigate } from 'react-router-dom';

const items = [
  { label: 'Actividades', icon: <FaClipboardCheck /> },
  { label: 'Material',    icon: <FaLayerGroup /> },
  { label: 'Productos',   icon: <FaBox /> },
  { label: 'Cotizaciones y Ordenes',     icon: <FaClipboardList /> },
  { label: 'Plantilla Cotización', icon: <FaFileWord /> },
  { label: 'Reportes', icon: <BiSolidReport /> },
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
              if (label === 'Cotizaciones y Ordenes') {
                navigate('/admin-home/orders');
              }
              if (label === 'Plantilla Cotización') {
                navigate('/admin-home/template-upload');
              }
              if (label === 'Reportes') {
                navigate('/admin-home/reports');
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
