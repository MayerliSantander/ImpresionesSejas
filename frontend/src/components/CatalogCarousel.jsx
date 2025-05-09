import React, { useState } from 'react';
import '../styles/CatalogCarousel.scss';
import logoSrc from '../assets/impresiones-sejas.png';
import GenericButton from './GenericButton';
import CarouselPage from './CarouselPage';
import CarouselHeader from './CarouselHeader';
import CarouselControls from './CarouselControls';
import GenericDropdown from './GenericDropdown';
import { TbShoppingBagPlus, TbTrash } from "react-icons/tb";
import ProductBag from './ProductBag';

export default function CatalogCarousel ({ categories }) {
  const [index, setIndex] = useState(0);
  const [productBag, setProductBag] = useState([]);
  const [showProductBag, setShowProductBag] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});

  const categoryPageMap = {};
  const pages = [];

  const handleSelectOption = (productId, key, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [key]: value },
    }));
  };

  const handleAddToProductBag = (product) => {
    const options = selectedOptions[product.id];
    const requiredKeys = Object.keys(product.options);

    const allSelected =
      options &&
      requiredKeys.every((key) => options[key] !== undefined && options[key] !== null);

    if (!allSelected) {
      return alert('Selecciona todas las opciones antes de agregar a la bolsa');
    }

    setProductBag([...productBag, { ...product, selectedOptions: options }]);
    alert(`${product.name} agregado a la bolsa`);
  };

  const handleRemoveFromProductBag = (index) => {
    setProductBag((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearBag = () => {
    setProductBag([]);
  };  

  pages.push({
    title: '',
    content: (
      <div className='cover'>
        <img src={logoSrc} className="img-fluid" alt="Logo Sejas" />
      </div>
    ),
  });

  pages.push({
    title: 'Categorías',
    content: (
      <div className="d-flex flex-column align-items-center gap-3">
        {categories.map((cat) => (
          <GenericButton
            key={cat.id}
            className="w-100"
            variant="blue-primary"
            onClick={() => setIndex(categoryPageMap[cat.id])}
          >
            Ir a {cat.name}
          </GenericButton>
        ))}
      </div>
    ),
  });

  let currentPageIndex = pages.length;

  categories.forEach(category => {
    categoryPageMap[category.id] = currentPageIndex;

    category.products.forEach(product => {
      pages.push({
        title: (
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <span>{product.name}</span>
            </div>
            <GenericButton
              variant="light"
              circle
              icon={<TbShoppingBagPlus size={26} />}
              onClick={() => handleAddToProductBag(product)}
            />
          </div>
        ),
        content: (
          <>
            <img src={product.image} alt={product.name} className="img-fluid mb-3" />
						<div className="d-flex flex-wrap gap-2 w-100">
							{Object.entries(product.options).map(([key, values]) => (
  						  <div key={key} className='dropdown-col'>
									<GenericDropdown
										label={key}
										options={values}
                    value={selectedOptions[product.id]?.[key] || null}
										onSelect={(selected) => {
                      handleSelectOption(product.id, key, selected)
										}}
									/>
								</div>
							))}
						</div>
          </>
        )
      });

      currentPageIndex++;
    });
  });

  const goToPrev = () => setIndex(prev => (prev > 0 ? prev - 1 : pages.length - 1));
  const goToNext = () => setIndex(prev => (prev + 1) % pages.length);

  return (
    <div className="catalog-container">
      <CarouselHeader 
        currentPage={index + 1} 
        totalPages={pages.length}
        onCartClick={() => setShowProductBag(!showProductBag)}
        bagCount={productBag.length}
      />
      <div className="carousel-wrapper">
        <CarouselControls direction="left" onClick={goToPrev} />
        <CarouselPage title={pages[index].title} content={pages[index].content} />
        <CarouselControls direction="right" onClick={goToNext} />
      </div>

      {showProductBag && (
        <div className="bag-overlay" onClick={() => setShowProductBag(false)}>
          <ProductBag
            bag={productBag}
            onRemove={handleRemoveFromProductBag}
            onClose={() => setShowProductBag(false)}
            onClearBag={handleClearBag}
          />
        </div>
      )}
    </div>
  );
};
