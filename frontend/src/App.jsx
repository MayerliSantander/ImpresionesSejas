import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ClientHome from './pages/ClientHome';
import AdminLayout from './layouts/AdminLayout';
import AdminHome from './pages/AdminHome';
import MaterialsPage from './pages/MaterialsPage';
import MaterialFormPage from './pages/MaterialFormPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/home" element={<ClientHome />} />
        <Route path="/admin-home" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path='materials' element={<MaterialsPage />} />
          <Route path='materials/new' element={<MaterialFormPage />} />
          <Route path="materials/edit/:id" element={<MaterialFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
