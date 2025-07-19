import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  
  return (
    <div className="product-card">
      <Link to={`/home/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <img src={product.imageUrls[0]} alt={product.productName} className="product-image" />
        <h4>{product.productName}</h4>
      </Link>
    </div>
  );
}
