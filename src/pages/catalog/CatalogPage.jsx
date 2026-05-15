import { useEffect, useState } from 'react';
import axios from 'axios';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        // Apuntamos al puerto que ya confirmaste que funciona
        const response = await axios.get('http://localhost:3001/api/catalog');
        setProducts(response.data);
      } catch (error) {
        console.error("Error cargando el catálogo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  if (loading) return <p>Cargando catálogo...</p>;

  return (
    <div className="catalog-container">
      <h1>Nuestro Catálogo</h1>
      <div className="grid">
        {products.map(product => (
          <div key={product._id} className="card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span>{product.price} BOB</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;