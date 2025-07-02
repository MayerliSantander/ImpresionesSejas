import React, { useEffect, useState } from 'react';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import GenericButton from '../components/GenericButton';
import { uploadTemplate, getCurrentTemplate } from '../services/templateService';

export default function TemplateUploadPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const navigate = useNavigate();

  const fetchTemplate = async () => {
    try {
      const data = await getCurrentTemplate();
      setCurrentTemplate(data);
    } catch {
      setCurrentTemplate(null);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, []);

  const handleUpload = async () => {
    setError(null);
    if (!file) {
      setError("Selecciona un archivo .docx");
      return;
    }

    if (!file.name.endsWith(".docx")) {
      setError("Solo se permiten archivos .docx");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await uploadTemplate(formData);
      alert("Plantilla actualizada con éxito.");
      setFile(null);
      fetchTemplate();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Error al subir plantilla");
      }
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-row flex-wrap align-items-center justify-content-between mb-4">
        <GenericButton
          variant="light"
          circle
          icon={<FiArrowLeft />}
          onClick={() => navigate('/admin-home')}
          className="me-2"
        />
        <h2 className="h1-t flex-grow-1 m-0">Plantilla de Cotización</h2>
      </div>

      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="mb-3">📁 Plantilla actual</h5>
        {currentTemplate ? (
          <ul className="mb-0">
            <li><strong>Archivo:</strong> {currentTemplate.fileName}</li>
            <li><strong>Tamaño:</strong> {currentTemplate.sizeKB} KB</li>
            <li><strong>Última modificación:</strong> {new Date(currentTemplate.lastModified).toLocaleString()}</li>
          </ul>
        ) : (
          <div className="alert alert-warning">No hay plantilla cargada aún.</div>
        )}
      </div>

      <div className="card p-4 shadow-sm">
        <h5 className="mb-3">📤 Subir nueva plantilla</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <input
            type="file"
            accept=".docx"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="alert alert-info" role="alert">
          Asegúrate de que tu plantilla contenga los siguientes campos en el formato exacto: 
          <strong>&#123;&#123;fecha&#125;&#125;, &#123;&#123;cliente&#125;&#125;, &#123;&#123;productos&#125;&#125;, &#123;&#123;subtotal&#125;&#125;, &#123;&#123;total&#125;&#125;, &#123;&#123;entrega&#125;&#125;, &#123;&#123;validez&#125;&#125;</strong>
        </div>
        <GenericButton
          variant="blue-primary"
          icon={<FiUpload />}
          iconPosition="right"
          onClick={handleUpload}
        >
          {currentTemplate ? 'Reemplazar plantilla' : 'Subir plantilla'}
        </GenericButton>
      </div>
    </div>
  );
}
