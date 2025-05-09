import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from './layouts/Layout';
import MaterialsPage from './pages/MaterialsPage';
import MaterialFormPage from './pages/MaterialFormPage';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/home" element={<Layout />}>
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
