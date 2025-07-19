import { FieldArray, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import FormInput from '../components/FormInput';
import GenericButton from '../components/GenericButton';
import { getActivities } from '../services/activityService';
import cloudinaryService from '../services/cloudinaryService';
import { getMaterials } from '../services/materialService';
import { createProduct, getProductById, updateProduct } from '../services/productService';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [errorMessage, setErrorMessage] = useState(null);

  const validationSchema = Yup.object({
    productName: Yup.string().required('El nombre es obligatorio'),
    minimumQuantity: Yup.number().typeError('Debe ser un número').integer('Debe ser un número entero').min(1, 'Debe ser al menos 1').required('La cantidad mínima es obligatoria'),
    category: Yup.string().required('La categoría es obligatoria'),
    sizeInCm: Yup.string().required('El tamaño en cm es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    images: Yup.array().test(
      'at-least-one-image',
      'Debe subir al menos una imagen',
      function (images) {
        const { imageUrls } = this.parent;
        const hasUploaded = images && images.length > 0;
        const hasExisting = imageUrls && imageUrls.length > 0;
        return hasUploaded || hasExisting;
      }
    ),
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
    sizeInCm: '',
    description: '',
    images: [],
    imageUrls: [],
    usedMaterials: [],
    activities: []
  });

  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [availableActivities, setAvailableActivities] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

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
              materialName: matchedMaterial
                ? `${matchedMaterial.materialName} (${matchedMaterial.type})`
                : 'Desconocido'

            };
        });

        setInitialValues({ 
          productName: data.productName, 
          minimumQuantity: data.minimumQuantity,
          category: data.category,
          sizeInCm: data.sizeInCm,
          description: data.description,
          usedMaterials: enrichedMaterials,
          activities: data.activityIds || [],
          images: [],
          imageUrls: data.imageUrls || []
        });
        setPreviewImages(data.imageUrls || []);
      });
    }
  }, [availableMaterials, id, isEdit]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    try {
      let finalImageUrls = values.imageUrls

      if (values.images && values.images.length > 0) {
        const uploadPromises = values.images.map(file => cloudinaryService.uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        finalImageUrls = [...finalImageUrls, ...uploadedUrls];
      }

      const payload = {
        productName: values.productName,
        minimumQuantity: values.minimumQuantity,
        category: values.category,
        sizeInCm: values.sizeInCm,
        description: values.description,
        imageUrls: finalImageUrls,
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
      setErrorMessage('Ocurrió un error al guardar el producto. Por favor, revisa los campos e inténtalo de nuevo.');
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
        {({ values, setFieldValue, isSubmitting, errors }) => (
          <Form noValidate>
            <FormInput
              label="Nombre"
              name="productName"
              placeholder="Ingrese el nombre del producto" />
            <FormInput
              label="Cantidad mínima"
              name="minimumQuantity"
              type="number"
              min="1"
              placeholder="Ingrese cantidad mínima" />
            <FormInput
              label="Categoría"
              name="category"
              placeholder="Ingrese la categoría" />
            <FormInput
              label="Tamaño (cm)"
              name="sizeInCm"
              placeholder="Ej: 9x5" />
            <FormInput
              label="Descripción"
              name="description"
              placeholder="Ingrese la descripción del producto"
              as="textarea"
              rows="5"
            />

            <div className="mb-3">
              <label className="form-label">Imágenes</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const previews = files.map(file => ({
                    file,
                    previewUrl: URL.createObjectURL(file)
                  }));
                  setPreviewImages(prev => [...prev, ...previews]);
                  setFieldValue('images', [...(values.images || []), ...files]);
                } } />
              <div className="mt-3 d-flex flex-wrap gap-2">
                {previewImages.map((image, index) => (
                  <div key={index} className="position-relative">
                    <img
                      src={image.previewUrl || image}
                      alt="preview"
                      className="img-thumbnail"
                      style={{ width: 160, height: 160, objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                      style={{ borderRadius: '50%', padding: '0.25rem 0.5rem' }}
                      onClick={() => {
                        const updatedPreviews = [...previewImages];
                        updatedPreviews.splice(index, 1);
                        setPreviewImages(updatedPreviews);

                        const updatedImages = [...(values.images || [])];
                        updatedImages.splice(index, 1);
                        setFieldValue('images', updatedImages);

                        const isFromUrls = typeof (image.previewUrl || image) === 'string' && !(image.file);
                        if (isFromUrls) {
                          const updatedUrls = [...values.imageUrls];
                          updatedUrls.splice(index, 1);
                          setFieldValue('imageUrls', updatedUrls);
                        }
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
              {errors.images && (
                <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>
                  {errors.images}
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
                      materialName: `${mat.materialName} (${mat.type})`,
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
                } }
              >
                {availableMaterials.map(mat => (
                  <option key={mat.id} value={mat.id}>{mat.materialName} ({mat.type})</option>
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
                        onChange={(e) => setFieldValue(`usedMaterials[${index}].quantity`, parseFloat(e.target.value))} />
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
                    } } />
                  <label className="form-check-label" htmlFor={act.id}>{act.activityName}</label>
                </div>
              ))}
              {errors.activities && typeof errors.activities === 'string' && (
                <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>
                  {errors.activities}
                </div>
              )}
            </div>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="d-flex gap-2">
              <GenericButton type="submit" variant="blue-primary" disabled={isSubmitting}>
                Aceptar
              </GenericButton>
              <GenericButton variant="outline-secondary" onClick={() => { navigate(-1); } }>
                Cancelar
              </GenericButton>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
