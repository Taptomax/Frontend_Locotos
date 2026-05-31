import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ManageSubscriptionPage from '../subscription/ManageSubscriptionPage';
import { 
  getProfilesByUser, 
  updateProfile, 
  deleteProfile,
  createProfile 
} from '../../services/profileService';

const SettingsPage = () => {

  const [activeTab, setActiveTab] = useState('subscription');
  const [notifications, setNotifications] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('');

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const defaultAvatar = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';

  // NOTIFICACIONES
  useEffect(() => {
    if (storedUser?.id_usuario) {
      axios
        .get(`http://localhost:3003/notifications/user/${storedUser.id_usuario}`)
        .then(res => setNotifications(res.data.notificaciones || []))
        .catch(console.error);
    }
  }, []);

  // PERFILES
  const loadProfiles = async () => {
    if (storedUser?.id_usuario && token) {
      const data = await getProfilesByUser(storedUser.id_usuario, token);
      setProfiles(data || []);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const handleSelect = (p) => {
    setSelectedProfile(p);
    setNewName(p.nombre);
    setNewAvatar(p.avatar_url || '');
  };

  const handleUpdate = async () => {
  if (!selectedProfile) return;

  const updated = await updateProfile(
    selectedProfile.id_perfil,
    {
      nombre: newName,
      avatar_url: newAvatar
    },
    token
  );

  if (updated) {
    alert("Actualizado");

    const refreshed = await getProfilesByUser(storedUser.id_usuario, token);
    setProfiles(refreshed);
  }
};

  const handleDelete = async () => {
    if (!selectedProfile) return;

    if (window.confirm("¿Eliminar perfil?")) {
      const ok = await deleteProfile(selectedProfile.id_perfil, token);

      if (ok) {
        alert("Eliminado");
        setSelectedProfile(null);
        setNewName('');
        setNewAvatar('');
        loadProfiles();
      }
    }
  };

  // CREAR BIEN USANDO SERVICE
  const handleCreate = async () => {
  if (!newName.trim()) {
    alert("El nombre es obligatorio");
    return;
  }

  try {
    const payload = {
      nombre: newName.trim(),
      id_usuario: Number(storedUser.id_usuario),
      avatar_url: newAvatar || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
      id_clasificacion_maxima: 4, 
      idioma_preferido: "es-BO",
      es_ninos: false
    };

    const result = await createProfile(payload, token);

    if (!result) {
      throw new Error("No se pudo crear");
    }

    alert("Perfil creado");

    // limpiar
    setNewName('');
    setNewAvatar('');
    setSelectedProfile(null);

    // recargar lista
    const updated = await getProfilesByUser(storedUser.id_usuario, token);
    setProfiles(updated);

  } catch (err) {
    console.error(err);
    alert("Error al crear perfil");
  }
};

  return (
    <div className="catalog-theme-wrapper dark-mode">

      {/* HEADER */}
      <div className="catalog-header">
        <h1 className="logo-text">LOCOTOS <span>SETTINGS</span></h1>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <button className="theme-toggle-btn" onClick={() => setActiveTab('subscription')}>
          💳 Suscripción
        </button>

        <button className="theme-toggle-btn" onClick={() => setActiveTab('notifications')}>
          Notificaciones
        </button>

        <button className="theme-toggle-btn" onClick={() => setActiveTab('profile')}>
          Perfil
        </button>
      </div>

      {/* CONTENIDO */}

      {activeTab === 'subscription' && <ManageSubscriptionPage />}

      {activeTab === 'notifications' && (
        <div className="content-card" style={{ padding: '20px' }}>
          <h2>Notificaciones</h2>
          {notifications.map((n, i) => <p key={i}>{n}</p>)}
        </div>
      )}

      {/* PERFIL */}
      {activeTab === 'profile' && (
        <>
          <h2 style={{ marginBottom: '20px' }}>Tus perfiles</h2>

          <div className="catalog-grid">
            {profiles.map(p => (
              <div
                key={p.id_perfil}
                className="content-card"
                onClick={() => handleSelect(p)}
              >
                <div className="poster-container">
                  <img
                    src={p.avatar_url || defaultAvatar}
                    className="poster-img"
                    onError={(e) => e.target.src = defaultAvatar} // 🔥 fallback
                  />
                </div>

                <div className="card-info">
                  <span className="content-title">{p.nombre}</span>
                </div>
              </div>
            ))}

            {/* CREAR */}
            <div 
              className="content-card" 
              onClick={() => {
                setSelectedProfile(null);
                setNewName('');
                setNewAvatar('');
              }}
            >
              <div className="poster-container">
                <div style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem'
                }}>
                  +
                </div>
              </div>
              <div className="card-info">
                <span className="content-title">Nuevo</span>
              </div>
            </div>
          </div>

          {/* EDITOR */}
          <div className="content-card" style={{ marginTop: '30px', padding: '20px' }}>
            <h3>{selectedProfile ? 'Editar Perfil' : 'Crear Perfil'}</h3>

            <input
              placeholder="Nombre"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <input
              placeholder="Avatar URL"
              value={newAvatar}
              onChange={(e) => setNewAvatar(e.target.value)}
            />

            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              {selectedProfile ? (
                <>
                  <button className="theme-toggle-btn" onClick={handleUpdate}>
                    Guardar
                  </button>

                  <button className="theme-toggle-btn" onClick={handleDelete}>
                    Eliminar
                  </button>
                </>
              ) : (
                <button className="theme-toggle-btn" onClick={handleCreate}>
                  Crear
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* LOGOUT */}
      <div style={{ marginTop: '40px' }}>
        <button className="theme-toggle-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;