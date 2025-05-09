import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MaterialsPage from './pages/MaterialsPage';
import MaterialFormPage from './pages/MaterialFormPage';
import Home from './pages/Home';
import ClientLayout from './layouts/ClientLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route 
          path="/home" 
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="quotes" element={<div>Mis Cotizaciones</div>} />
        </Route>
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path='materials' element={<MaterialsPage />} />
          <Route path='materials/new' element={<MaterialFormPage />} />
          <Route path="materials/edit/:id" element={<MaterialFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
