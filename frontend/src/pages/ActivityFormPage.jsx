import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import GenericButton from '../components/GenericButton';
import FormInput from '../components/FormInput';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { createActivity, getActivityById, updateActivity } from '../services/activityService';

const validationSchema = Yup.object({
	activityName: Yup.string()
		.required('El nombre es obligatorio'),
	price: Yup.number()
		.typeError('El precio debe ser un número')
		.min(0.1, 'El precio no puede ser negativo')
		.required('El precio es obligatorio'),
});

export default function ActivityFormPage() {
	const { id } = useParams();
  const navigate = useNavigate();
	const isEdit = Boolean(id);
  const [initialValues, setInitialValues] = useState({ activityName: '', price: ''});

	useEffect(() => {
    if (isEdit) {
      getActivityById(id).then(data => {
        setInitialValues({
          activityName: data.activityName,
          price: data.price,
        });
      });
    }
  }, [id, isEdit]);

	const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
			if (isEdit) await updateActivity(id, values);
      else await createActivity(values);
      navigate('/admin-home/activities');
    } catch (error) {
      console.error(error);
      setErrors({ submit: error.message || 'Error al guardar la actividad' });
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
          <h2 className="h1-t mb-0">{isEdit ? 'Editar Actividad' : 'Nueva Actividad'}</h2>
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
								name="activityName"
                placeholder="Ingrese el nombre de la actividad"
							/>
							<FormInput
								label="Precio"
								name="price"
								type="number"
								step="0.01"
								min="0.1"
                placeholder="Ingrese el precio"
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
