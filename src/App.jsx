import React, { useState, useEffect } from 'react'; //
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilesPage from './pages/ProfilesPage';
import CreateProfile from './pages/CreateProfile';
import EditProfile from './pages/EditProfile';
import VerifyCodePage from './pages/VerifyCodePage';
import CatalogPage from './pages/catalog/CatalogPage';
import PlansPage from './pages/subscription/PlansPage';
import CheckoutPage from './pages/subscription/CheckoutPage';
import ManageSubscriptionPage from './pages/subscription/ManageSubscriptionPage';
import MyListPage from './pages/mylist/MyListPage';
import SettingsPage from "./pages/catalog/SettingsPage";
import DetailsPage from './pages/details/DetailsPage';
import WatchPage from './pages/watch/WatchPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// ─── COMPONENTES DE PRUEBA MIAURI ───────────────────────────────────────────
function VideoPlayerMiauri() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apunta al puerto 3006 configurado en tu docker-compose para el catálogo
    fetch('http://localhost:3006/api/stream/64b0f1a2c3d4e5f6a7b8c9d0')
      .then(res => res.json())
      .then(data => {
        setVideo(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando video...</p>; //
  if (!video) return <p>Error al cargar</p>; //

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px 0' }}>
      <h3>Reproductor (Miauri)</h3>
      <video controls style={{ width: '100%', maxWidth: '640px' }} src={video.url} />
    </div>
  ); //
}

function WatchLaterMiauri() {
  const [userId] = useState('1'); //
  const [contentId, setContentId] = useState('123'); //
  const [items, setItems] = useState([]); //

  const add = async () => {
    const res = await fetch('http://localhost:8000/watch-later/', { //
      method: 'POST', //
      headers: { 'Content-Type': 'application/json' }, //
      body: JSON.stringify({ user_id: userId, content_id: contentId }) //
    });
    alert(res.ok ? 'Agregado' : 'Error'); //
    getList(); //
  };

  const getList = async () => {
    const res = await fetch(`http://localhost:3011/watch-later/${userId}/`); //
    setItems(await res.json()); //
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px 0' }}>
      <h3>Ver más tarde (Miauri)</h3>
      <input value={contentId} onChange={(e) => setContentId(e.target.value)} placeholder="ID contenido" />
      <button onClick={add}>Agregar</button>
      <button onClick={getList}>Cargar</button>
      <ul>
        {items.map((item, idx) => <li key={idx}>{item.content_id}</li>)}
      </ul>
    </div>
  ); //
}
// ─── FIN COMPONENTES MIAURI ─────────────────────────────────────────────────

const ProtectedRoute = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const tieneAccesoTotal = storedUser && storedUser.estado === "activo";

  // Aquí corregí el nombre de la variable (eliminado el "Access" extra)
  if (!tieneAccesoTotal) {
    return <Navigate to="/subscription/plans" replace />;
  }

  return children;
};

function App() {
  return (
    <> {/* Etiqueta de apertura Fragment */}
      <Router>
        <Routes>
          {/* Redirección Inicial */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* PORTAL PÚBLICO */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyCodePage />} />

          {/* PASARELA DE PAGO (Accesible para inactivos para que puedan activar su suscripción) */}
          <Route path="/subscription/plans" element={<PlansPage />} />
          <Route path="/subscription/checkout/:planId" element={<CheckoutPage />} />
          <Route path="/subscription/manage" element={<ManageSubscriptionPage />} />
          
          {/* TODAS LAS DEMÁS RUTAS BLINDADAS (Solo entran si 'estado' es 'activo') */}
          <Route path="/perfiles" element={<ProtectedRoute><ProfilesPage /></ProtectedRoute>} />
          <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
          <Route path="/edit-profile/:id" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/catalog" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
          <Route path="/details/:id" element={<DetailsPage />} />
          <Route path="/mylist" element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/watch/:contentId" element={<ProtectedRoute><WatchPage /></ProtectedRoute>} />

          {/* Modulo independiente de administracion de contenido y estadisticas */}
          <Route path="/admin" element={<Navigate to="/admin/content" replace />} />
          <Route path="/admin/content" element={<AdminContentPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* Captura cualquier link roto y lo manda al login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </> 
  );
}

export default App;
