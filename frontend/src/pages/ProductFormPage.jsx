import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import GenericButton from '../components/GenericButton';
import FormInput from '../components/FormInput';
import * as Yup from 'yup';
import { FieldArray, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { createProduct, getProductById, updateProduct } from '../services/productService';
import { getMaterials } from '../services/materialService';
import { getActivities } from '../services/activityService';
import cloudinaryService from '../services/cloudinaryService';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const validationSchema = Yup.object({
    productName: Yup.string().required('El nombre es obligatorio'),
    minimumQuantity: Yup.number().typeError('Debe ser un número').integer('Debe ser un número entero').min(1, 'Debe ser al menos 1').required('La cantidad mínima es obligatoria'),
    category: Yup.string().required('La categoría es obligatoria'),
    image: isEdit ? Yup.mixed().nullable() : Yup.mixed().required('La imagen es obligatoria'),
    usedMaterials: Yup.array().of(
      Yup.object().shape({
        materialId: Yup.string().required('Debe seleccionar un material'),
        quantity: Yup.number().typeError('Debe ser un número').integer('Debe ser un número entero').min(1, 'Cantidad mínima: 1').required('Cantidad requerida')
      })
    ).min(1, 'Debe agregar al menos un material'),
    activities: Yup.array().of(Yup.string().required('Debe seleccionar una actividad')).min(1, 'Debe seleccionar al menos una actividad')
  });

  const [initialValues, setInitialValues] = useState({ 
    productName: '', 
    minimumQuantity: '',  
    category: '',
    image: null,
    usedMaterials: [],
    activities: []
  });

  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [availableActivities, setAvailableActivities] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materials = await getMaterials();
        setAvailableMaterials(materials);
      } catch (error) {
        console.error('Error al cargar materiales:', error);
      }
    };

    const fetchActivities = async () => {
      try {
        const activities = await getActivities();
        setAvailableActivities(activities);
      } catch (error) {
        console.error('Error al cargar actividades:', error);
      }
    };

    fetchMaterials();
    fetchActivities();
  }, []);

  useEffect(() => {
    if (isEdit) {
      getProductById(id).then(data => {
        const enrichedMaterials = (data.usedMaterials || []).map(um => {
          const matchedMaterial = availableMaterials.find(m => m.id === um.materialId);
            return {
              ...um,
              materialName: matchedMaterial ? matchedMaterial.materialName : 'Desconocido'
            };
        });

        setInitialValues({ 
          productName: data.productName, 
          minimumQuantity: data.minimumQuantity,
          category: data.category,
          usedMaterials: enrichedMaterials,
          activities: data.activityIds || [],
          image: null,
          imageUrl: data.imageUrl || null
        });
        setPreviewImage(data.imageUrl || null);
      });
    }
  }, [availableMaterials, id, isEdit]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      let finalImageUrl = values.imageUrl;

      if (values.image) {
        finalImageUrl = await cloudinaryService.uploadImage(values.image);
      }

      const payload = {
        productName: values.productName,
        minimumQuantity: values.minimumQuantity,
        category: values.category,
        imageUrl: finalImageUrl,
        activityIds: values.activities,
        usedMaterials: values.usedMaterials.map(m => ({
          materialId: m.materialId,
          quantity: m.quantity
        })),
      };
      if (isEdit) await updateProduct(id, payload);
      else await createProduct(payload);
      navigate('/admin-home/products');
    } catch (error) {
      setErrors({ submit: error.message || 'Error al guardar' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-3">
        <GenericButton
          variant="light"
          circle
          icon={<FiArrowLeft />}
          onClick={() => navigate(-1)}
          className="me-2"
        />
        <h2 className="h1-t mb-0">{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form noValidate>
            <FormInput
              label="Nombre"
              name="productName"
              placeholder="Ingrese el nombre del producto"
            />
            <FormInput 
              label="Cantidad mínima" 
              name="minimumQuantity" 
              type="number" 
              min="1" 
              placeholder="Ingrese cantidad mínima" 
            />
            <FormInput 
              label="Categoría" 
              name="category" 
              placeholder="Ingrese la categoría" 
            />

            <div className="mb-3">
              <label className="form-label">Imagen</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFieldValue('image', file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setPreviewImage(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {previewImage && (
                <img src={previewImage} alt="preview" className="mt-2 img-thumbnail" style={{ maxHeight: '200px' }} />
              )}
              {touched.image && errors.image && (
                <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>
                  {errors.image}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Materiales usados</label>
              <select
                multiple
                className="form-select"
                onChange={(e) => {
                  const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                  const selectedMaterials = availableMaterials
                    .filter(mat => selectedIds.includes(mat.id))
                    .map(mat => ({
                      materialId: mat.id,
                      materialName: mat.materialName,
                      quantity: ''
                    }));

                  const existingIds = values.usedMaterials.map(m => m.materialId);
                  const merged = [...values.usedMaterials];

                  selectedMaterials.forEach(newMat => {
                    if (!existingIds.includes(newMat.materialId)) {
                      merged.push(newMat);
                    }
                  });

                  setFieldValue('usedMaterials', merged);
                }}
              >
                {availableMaterials.map(mat => (
                  <option key={mat.id} value={mat.id}>{mat.materialName}</option>
                ))}
              </select>
            </div>

            <FieldArray name="usedMaterials">
              {({ remove }) => (
                values.usedMaterials.map((mat, index) => (
                  <div key={mat.materialId} className="d-flex align-items-start mb-2 gap-2">
                    <span className="flex-grow-1 pt-2">{mat.materialName}</span>
                    <div className="d-flex flex-column w-25">
                      <input
                        type="number"
                        className={`form-control ${errors.usedMaterials?.[index]?.quantity ? 'is-invalid' : ''}`}
                        min="1"
                        placeholder="Cantidad"
                        value={values.usedMaterials[index].quantity}
                        onChange={(e) =>
                          setFieldValue(`usedMaterials[${index}].quantity`, parseFloat(e.target.value))
                        }
                      />
                      {errors.usedMaterials?.[index]?.quantity && (
                        <div className="invalid-feedback d-block">
                          {errors.usedMaterials[index].quantity}
                        </div>
                      )}
                    </div>
                    <button type="button" className="btn btn-outline-danger btn-sm mt-1" onClick={() => remove(index)}>X</button>
                  </div>
                  
                ))
              )}
            </FieldArray>
            {errors.usedMaterials && typeof errors.usedMaterials === 'string' && (
              <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>
                {errors.usedMaterials}
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Actividades</label>
              {availableActivities.map(act => (
                <div className="form-check" key={act.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={act.id}
                    checked={values.activities.includes(act.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFieldValue('activities', [...values.activities, act.id]);
                      } else {
                        setFieldValue('activities', values.activities.filter(a => a !== act.id));
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor={act.id}>{act.activityName}</label>
                </div>
              ))}
              {errors.activities && typeof errors.activities === 'string' && (
                <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>
                  {errors.activities}
                </div>
              )}
            </div>

            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
            <div className="d-flex gap-2">
              <GenericButton type="submit" variant="blue-primary" disabled={isSubmitting}>
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
  );
}
