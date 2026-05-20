import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../catalog/CatalogPage.css'; 


const getMovieId = (title) => {
  if (!title) return 0;
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const MyListPage = () => {
  const [products, setProducts] = useState([]);
  const [favContentIds, setFavContentIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchListData = async () => {
      try {
        const catalogRes = await axios.get('http://localhost:3001/api/catalog');
        setProducts(catalogRes.data);

        if (storedUser?.id_usuario) {
          const favsRes = await axios.get(`http://localhost:3010/favorites/user/${storedUser.id_usuario}`);
          const ids = (favsRes.data.favoritos || []).map(f => Number(f.id_contenido));
          setFavContentIds(ids);
        }
      } catch (error) {
        console.error("Error cargando la lista de favoritos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListData();
  }, []);

  const handleRemoveFavorite = async (idContenido) => {
    const userIdNum = Number(storedUser.id_usuario);
    const idNum = Number(idContenido);

    try {
      await axios.delete(`http://localhost:3010/favorites/user/${userIdNum}/content/${idNum}`);
      setFavContentIds(prev => prev.filter(id => id !== idNum));
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  };

  if (loading) return (
    <div className="catalog-loading dark-mode">
      <div className="loader-text">CARGANDO TU LISTA...</div>
    </div>
  );

  return (
    <div className="catalog-theme-wrapper dark-mode" style={{ padding: '2rem 5%' }}>
      <header className="catalog-header" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button 
          onClick={() => navigate('/catalog')} 
          style={{ background: '#8AD5DF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#1f3a4a' }}
        >
          ← Volver al Catálogo
        </button>
        <div className="brand">
          <h1 className="logo-text" style={{ fontSize: '2.2rem' }}>Mi <span>Lista</span></h1>
          <p className="subtitle">Tus contenidos guardados</p>
        </div>
      </header>

      <main className="catalog-grid" style={{ marginTop: '2rem' }}>
        {favContentIds.length === 0 ? (
          <p style={{ color: '#FAFBFD', opacity: 0.6, fontSize: '1.2rem', gridColumn: '1/-1', textAlign: 'center', marginTop: '3rem' }}>
            No tienes películas guardadas en tu lista aún.
          </p>
        ) : (
          favContentIds.map((idFavorito) => {
           
            const movie = products.find(p => getMovieId(p.titulo || p.name) === idFavorito);
            if (!movie) return null;

            return (
              <div key={idFavorito} className="content-card" style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => handleRemoveFavorite(idFavorito)}
                  style={{
                    position: 'absolute', top: '12px', left: '12px', zIndex: 10,
                    background: 'rgba(225, 130, 203, 0.9)', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white', fontWeight: 'bold'
                  }}
                  title="Quitar de mi lista"
                >
                  ✕
                </button>

                <div className="poster-container">
                  <img src={movie.poster || movie.imagen_url} alt={movie.titulo} className="poster-img" />
                  <div className="card-overlay">
                    <span className="calificacion-badge">⭐ {movie.calificacion || '8.0'}</span>
                  </div>
                </div>
                <div className="card-info">
                  <span className="content-type">{movie.tipo || 'Película'}</span>
                  <h3 className="content-title">{movie.titulo || movie.name}</h3>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default MyListPage;