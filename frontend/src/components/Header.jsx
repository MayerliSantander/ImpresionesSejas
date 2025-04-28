import React from 'react';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';
import logoSrc from '../assets/react.svg';
import '../styles/_Header.scss';
import { FaRegUser } from "react-icons/fa";

export default function Header() {
  return (
    <Navbar className="header-navbar px-4" variant="dark">
      <Navbar.Brand href="/admin-home">
        <img src={logoSrc} height="48" alt="Logo Sejas" />
      </Navbar.Brand>
      <Nav className="ms-auto">
				<NavDropdown
          id="user-nav-dropdown"
          title={<FaRegUser size={28} />}
          align="end"
          menuVariant="dark"
        >
          <NavDropdown.Item href="/configuration">
            Configuración
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/">
            Cerrar sesión
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}
