import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import GenericButton from '../components/GenericButton';
import FormInput from '../components/FormInput';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { createMaterial, getMaterialById, updateMaterial } from '../services/materialService';
import { useEffect, useState } from 'react';

const validationSchema = Yup.object({
	materialName: Yup.string()
		.required('El nombre es obligatorio'),
	materialPrice: Yup.number()
		.typeError('El precio debe ser un número')
		.min(0.1, 'El precio no puede ser negativo')
		.required('El precio es obligatorio'),
	size: Yup.string()
		.required('El tamaño es obligatorio'),
	type: Yup.string()
		.required('El tipo es obligatorio'),
});

export default function MaterialFormPage() {
	const { id } = useParams();
  const navigate = useNavigate();
	const isEdit = Boolean(id);
  const [initialValues, setInitialValues] = useState({ materialName: '', materialPrice: '', size: '', type: '' });

	useEffect(() => {
    if (isEdit) {
      getMaterialById(id).then(data => {
        setInitialValues({
          materialName: data.materialName,
          materialPrice: data.materialPrice,
          size: data.size,
          type: data.type,
        });
      });
    }
  }, [id, isEdit]);

	const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
			if (isEdit) await updateMaterial(id, values);
      else await createMaterial(values);
      navigate('/admin-home/materials');
    } catch (error) {
      console.error(error);
      setErrors({ submit: error.message || 'Error al guardar el material' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="container py-4">
        <div className="d-flex align-items-center mb-3">
          <GenericButton
            variant="light"
            circle
            icon={<FiArrowLeft />}
            onClick={() => navigate(-1)}
            className="me-2"
          />
          <h2 className="h1-t mb-0">{isEdit ? 'Editar Material' : 'Nuevo Material'}</h2>
				</div>

        <Formik
					enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
					{({ isSubmitting, errors }) => (
						<Form noValidate>
		        	<FormInput
								label="Nombre"
								name="materialName"
                placeholder="Ingrese el nombre del material"
							/>
							<FormInput
								label="Precio"
								name="materialPrice"
								type="number"
								step="0.01"
								min="0.1"
                placeholder="Ingrese el precio"
							/>
							<FormInput
								label="Tamaño"
								name="size"
								placeholder="Ingrese el tamaño"
							/>
							<FormInput
								label="Tipo"
								name="type"
								placeholder="Ingrese el tipo"
							/>
							{errors.submit && (
                <div className="alert alert-danger">{errors.submit}</div>
              )}
							<div className="d-flex gap-2">
								<GenericButton 
									variant="blue-primary" 
									type="submit"
									disabled={isSubmitting}
								>
									Aceptar
								</GenericButton>
								<GenericButton variant="outline-secondary" onClick={() => navigate(-1)}>
									Cancelar
								</GenericButton>
							</div>
						</Form>
					)}
        </Formik>
			</div>
    </>
  );
}
