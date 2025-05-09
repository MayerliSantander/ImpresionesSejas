import React from 'react';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';
import logoSrc from '../assets/impresiones-sejas.png';
import '../styles/_Header.scss';
import { FaRegUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Header({role}) {
  const navigate = useNavigate();

  return (
    <Navbar className="header-navbar px-4" variant="dark">
      <Navbar.Brand onClick={() => navigate(role === 'admin' ? '/admin-home' : '/home')} style={{ cursor: 'pointer' }}>
        <img src={logoSrc} height="48" alt="Logo Sejas" />
      </Navbar.Brand>
      <Nav className="header-nav ms-auto">
        {role === 'client' && (
          <Nav.Link onClick={() => navigate('/home/quotes')}>Mis Cotizaciones</Nav.Link>
        )}
				<NavDropdown
          id="user-nav-dropdown"
          title={<FaRegUser size={28} />}
          align="end"
          menuVariant="dark"
        >
          <NavDropdown.Item onClick={() => navigate('/configuration')}>
            Configuración
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item 
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            Cerrar sesión
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}
