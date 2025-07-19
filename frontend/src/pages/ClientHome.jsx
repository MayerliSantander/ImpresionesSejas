import '../styles/Catalog.scss';
import { useEffect, useState } from 'react';
import { getCategories, getProductsByCategory } from '../services/productService';
import ProductCard from '../components/ProductCard';

export default function ClientHome() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0]);
          fetchProducts(categoriesData[0]);
        }
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  async function fetchProducts(category) {
    try {
      const productsData = await getProductsByCategory(category);
      setProducts(productsData);
    } catch (error) {
      console.error('Error al obtener productos de la categoría:', error);
    }
  }

  return (
    <div className="tabs-container">
      <div className="tabs">
        {categories.length === 0 ? (
          <p>Cargando categorías...</p>
        ) : (
          categories.map((category) => (
            <button
              key={category}
              className={`tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))
        )}
      </div>

      {selectedCategory && (
        <div className="products-container">
          <h3>Productos en {selectedCategory}</h3>
          {products.length === 0 ? (
            <p>No hay productos disponibles para esta categoría.</p>
          ) : (
            <div className="product-cards">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
