import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSrc from '../assets/impresiones-sejas.png';
import '../styles/LoginPage.scss';
import { verifyToken } from '../services/authService';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      navigate(role === 'admin' ? '/admin-home' : '/home', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <div className="login-header d-flex align-items-center justify-content-center">
        <img src={logoSrc} alt="Sejas" className="logo-login" />
      </div>

      <div className="login-form-container d-flex flex-column align-items-center">
        <h2 className='login-title'>Inicio de Sesión</h2>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const idToken = credentialResponse.credential;
              localStorage.setItem('token', idToken);

              const user = await verifyToken(idToken);
              if (user && user.roles && user.roles.length > 0) {
                const role = user.roles[0].description;
                localStorage.setItem('role', role);
                const username = user.name || user.email || 'Usuario';
                localStorage.setItem('username', username);
                localStorage.setItem('userId', user.id);
                if (user.phone) {
                  localStorage.setItem('userPhone', user.phone);
                }
                navigate(role === 'admin' ? '/home' : '/home', { replace: true });
              } else {
                console.error('El usuario no tiene roles definidos:', user);
              }
            } catch (error) {
              console.error('Error al verificar token:', error);
            }
          }}
          onError={() => {
            console.log("Error al iniciar sesión con Google");
          }}
          width={300}
        />
      </div>
    </div>
  );
}
