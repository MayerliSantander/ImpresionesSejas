import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaClock,
  FaShoppingBag,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/_Header.scss";
import logoSrc from "../assets/impresiones-sejas.png";
import ProductBag from "./ProductBag"
import { useBag } from "../utils/BagContext";

export default function Header({ role, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const isAdmin = role === "admin";
  const { bag, showBag, toggleBag, removeFromBag, clearBag } = useBag();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showBag && isMobile) {
      setMenuOpen(false);
    }
  }, [showBag, isMobile]);

  useEffect(() => {
  if (showBag) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [showBag]);

  return (
    <>
      <header className="main-header">
        <div className="header-content">
          <div className="header-left">
            <img
              src={logoSrc}
              alt="Logo"
              className="logo"
              onClick={() => navigate("/home")}
            />
          </div>

          {!isMobile && !isAdmin && (
            <nav className="nav-links">
              <li onClick={() => navigate("/home")}>
                <FaHome /> Comenzar cotización
              </li>
              <li onClick={() => navigate("/home/quotes")}>
                <FaClock /> Historial de cotizaciones
              </li>
              <li onClick={toggleBag}>
                <FaShoppingBag /> 
                Bolsa
                {bag.length > 0 && <span className="bag-counter">{bag.length}</span>}
              </li>
            </nav>
          )}

          {(!isMobile || isAdmin) && (
            <div
              className="user-menu"
              ref={userMenuRef}
              onClick={() => setShowUserMenu((prev) => !prev)}
            >
              <FaUser /> {user}
              {showUserMenu && (
                <div className="user-dropdown">
                  <div onClick={() => navigate("/configuration")}>
                    <FaCog /> Configuración del perfil
                  </div>
                  <div onClick={handleLogout}>
                    <FaSignOutAlt /> Cerrar sesión
                  </div>
                </div>
              )}
            </div>
          )}

          {isMobile && !isAdmin && (
            <button className="menu-toggle" onClick={() => setMenuOpen(true)}>
              <FaBars size={22} />
            </button>
          )}
        </div>

        {isMobile && !isAdmin && menuOpen && (
          <div className="sidebar-overlay" onClick={() => setMenuOpen(false)}>
            <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setMenuOpen(false)}>
                <FaTimes size={20} />
              </button>

              <nav className="sidebar-nav">
                <ul>
                  <li
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/home");
                    }}
                  >
                    <FaHome /> <span>Comenzar cotización</span>
                  </li>
                  <li
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/home/quotes");
                    }}
                  >
                    <FaClock /> <span>Historial de cotizaciones</span>
                  </li>
                  <li onClick={toggleBag} className="bag-icon-wrapper">
                    <FaShoppingBag /> 
                    Bolsa
                    {bag.length > 0 && <span className="bag-counter">{bag.length}</span>}
                  </li>
                </ul>
              </nav>

              <div className="sidebar-user">
                <div className="user-info">
                  <FaUser /> <span>{user}</span>
                </div>
                <ul>
                  <li
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/configuration");
                    }}
                  >
                    <FaCog /> <span>Configuración del Perfil</span>
                  </li>
                  <li
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <FaSignOutAlt /> <span>Cerrar sesión</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </header>
      {showBag && (
        <div className="bag-overlay" onClick={toggleBag}>
          <ProductBag
            bag={bag}
            onRemove={removeFromBag}
            onClearBag={clearBag}
            onClose={toggleBag}
          />
        </div>
      )}
    </>
  );
}
