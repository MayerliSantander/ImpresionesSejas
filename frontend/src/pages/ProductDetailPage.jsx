import '../styles/ProductDetailPage.scss';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import GenericDropdown from '../components/GenericDropdown';
import FormInput from '../components/FormInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getActivities } from '../services/activityService';
import { getMaterials } from '../services/materialService';
import GenericButton from '../components/GenericButton';
import { TbShoppingBagPlus } from 'react-icons/tb';
import { FaArrowLeft } from 'react-icons/fa';
import { useBag } from '../utils/BagContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
	const [paperOptions, setPaperOptions] = useState([]);
	const [printOptions, setPrintOptions] = useState([]);
	const [finishOptions, setFinishOptions] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const navigate = useNavigate();
	const { addToBag } = useBag();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProductById(id);
				const allMaterials = await getMaterials();
      	const allActivities = await getActivities();

				const paperOpts = productData.usedMaterials.map(used => {
					const material = allMaterials.find(m => m.id === used.materialId);
					return material ? `${material.materialName} (${material.type})` : 'Desconocido';
				});

				const productActivities = productData.activityIds.map(id =>
					allActivities.find(act => act.id === id)
				);
				
				const printOpts = productActivities
					.filter(act => act && act.activityName.toLowerCase().startsWith('impresión'))
					.map(act => act.activityName);

				const finishOpts = productActivities
					.filter(act => act && act.activityName.toLowerCase().startsWith('acabado'))
					.map(act => act.activityName);

				setProduct(productData);
				setPaperOptions(paperOpts);
				setPrintOptions(printOpts);
				setFinishOptions(finishOpts);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    }

    fetchProduct();
  }, [id]);

  const handleAddToBag = (values) => {
		const requiredFields = ['size', 'quantity', 'paper', 'printType'];
		if (isCardProduct) requiredFields.push('finish');

		for (const field of requiredFields) {
			if (!values[field]) {
				console.log('Campo faltante:', field, '→', values[field]);
				alert('Por favor, completa todos los campos.');
				return;
			}
		}

		const newItem = {
			name: product.productName,
			selectedOptions: values
		};

		addToBag(newItem);
		alert('Producto agregado a la bolsa');
	};

  if (!product) return <div>Cargando...</div>;

	const isCardProduct = product.productName.trim().toLowerCase() === 'tarjetas de presentación';

  const validationSchema = Yup.object({
    size: Yup.string().required('Tamaño es obligatorio'),
    quantity: Yup.number()
      .min(product.minimumQuantity, `La cantidad mínima es ${product.minimumQuantity}`)
      .required('Cantidad es obligatoria'),
    paper: Yup.string().required('Selecciona un tipo de papel'),
    printType: Yup.string().required('Selecciona tipo de impresión'),
    finish: isCardProduct ? Yup.string().required('Selecciona un acabado') : Yup.string(),
  });

  return (
    <div className="product-detail-container">
			<GenericButton
				onClick={() => navigate('/home')}
				icon={<FaArrowLeft />}
				variant="light"
				size="sm"
				circle
				className="back-icon-button"
			/>

      <div className="product-images">
				<img
					src={selectedImage || product.imageUrls[0]}
					alt={product.productName}
					className="main-image"
				/>

				<div className="thumbnail-row">
					{product.imageUrls.map((url, index) => (
						<img
							key={index}
							src={url}
							alt={`Vista ${index + 1}`}
							className={`thumbnail ${selectedImage === url ? 'active' : ''}`}
							onClick={() => setSelectedImage(url)}
						/>
					))}
				</div>
			</div>

      <div className="product-options">
        <h2>{product.productName}</h2>
        <p>{product.description || 'Descripción no disponible'}</p>

        <Formik
          initialValues={{
            size: '',
            quantity: '',
            paper: '',
            printType: '',
            finish: ''
          }}
          validationSchema={validationSchema}
					onSubmit={(values) => handleAddToBag(values)}
        >
          {({ handleChange }) => (
            <Form className="options">
              <GenericDropdown
                label="Tamaño"
                name="size"
                options={[product.sizeInCm]}
              />

              <FormInput
                label="Cantidad"
                name="quantity"
                type="number"
                onChange={handleChange}
                min={product.minimumQuantity}
                placeholder={`Mínimo ${product.minimumQuantity}`}
              />

              <GenericDropdown
                label="Tipo de papel"
                name="paper"
                options={paperOptions}
              />

              <GenericDropdown
                label="Impresión"
                name="printType"
                options={printOptions}
              />

              {isCardProduct && (
                <GenericDropdown
                  label="Acabado"
                  name="finish"
                  options={finishOptions}
                />
              )}

              <GenericButton
								type="submit"
								variant="blue-primary"
								className="add-to-bag-button"
								icon={<TbShoppingBagPlus />}
								iconPosition='right'
							>
								Agregar a la bolsa
							</GenericButton>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
