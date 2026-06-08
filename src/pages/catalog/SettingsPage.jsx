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
import { useLocotosTheme } from '../../hooks/useLocotosTheme';
import './CatalogPage.css';
import './SettingsPage.css';

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
  const { darkMode, toggleTheme, wrapperClass } = useLocotosTheme(true);

  const defaultAvatar = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';
  const previewAvatar = newAvatar || selectedProfile?.avatar_url || defaultAvatar;

  useEffect(() => {
    if (storedUser?.id_usuario) {
      axios
        .get(`http://localhost:3003/notifications/user/${storedUser.id_usuario}`)
        .then(res => setNotifications(res.data.notificaciones || []))
        .catch(console.error);
    }
  }, []);

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

  const handleSelect = (profile) => {
    setSelectedProfile(profile);
    setNewName(profile.nombre);
    setNewAvatar(profile.avatar_url || '');
  };

  const handleUpdate = async () => {
    if (!selectedProfile) return;

    const updated = await updateProfile(
      selectedProfile.id_perfil,
      { nombre: newName, avatar_url: newAvatar },
      token
    );

    if (updated) {
      alert('Perfil actualizado');
      setProfiles(await getProfilesByUser(storedUser.id_usuario, token));
    }
  };

  const handleDelete = async () => {
    if (!selectedProfile) return;
    if (!window.confirm('¿Eliminar perfil?')) return;

    const ok = await deleteProfile(selectedProfile.id_perfil, token);
    if (ok) {
      alert('Perfil eliminado');
      setSelectedProfile(null);
      setNewName('');
      setNewAvatar('');
      loadProfiles();
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      const result = await createProfile({
        nombre: newName.trim(),
        id_usuario: Number(storedUser.id_usuario),
        avatar_url: newAvatar || defaultAvatar,
        id_clasificacion_maxima: 4,
        idioma_preferido: 'es-BO',
        es_ninos: false
      }, token);

      if (!result) throw new Error('No se pudo crear');

      alert('Perfil creado');
      setNewName('');
      setNewAvatar('');
      setSelectedProfile(null);
      setProfiles(await getProfilesByUser(storedUser.id_usuario, token));
    } catch (err) {
      console.error(err);
      alert('Error al crear perfil');
    }
  };

  const resetEditor = () => {
    setSelectedProfile(null);
    setNewName('');
    setNewAvatar('');
  };

  return (
    <div className={`${wrapperClass} settings-shell`}>
      <div className="settings-topbar">
        <div className="catalog-header">
          <h1 className="logo-text">LOCOTOS <span>SETTINGS</span></h1>
        </div>
        <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
          {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
      </div>

      <div className="settings-tabs">
        {[
          { id: 'subscription', label: '💳 Suscripción' },
          { id: 'notifications', label: '🔔 Notificaciones' },
          { id: 'profile', label: '👤 Perfil' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'subscription' && <ManageSubscriptionPage />}

      {activeTab === 'notifications' && (
        <div className="content-card" style={{ padding: '20px' }}>
          <h2>Notificaciones</h2>
          {notifications.length === 0 ? (
            <p>No tienes notificaciones recientes.</p>
          ) : (
            notifications.map((n, i) => <p key={i}>{n}</p>)
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <>
          <h2 style={{ marginBottom: '20px' }}>Tus perfiles</h2>

          <div className="catalog-grid">
            {profiles.map((profile) => (
              <div
                key={profile.id_perfil}
                className="content-card"
                onClick={() => handleSelect(profile)}
              >
                <div className="poster-container">
                  <img
                    src={profile.avatar_url || defaultAvatar}
                    alt={profile.nombre}
                    className="poster-img"
                    onError={(e) => { e.target.src = defaultAvatar; }}
                  />
                </div>
                <div className="card-info">
                  <span className="content-title">{profile.nombre}</span>
                </div>
              </div>
            ))}

            <div className="content-card" onClick={resetEditor}>
              <div className="poster-container">
                <div style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  color: 'var(--accent-2)'
                }}>
                  +
                </div>
              </div>
              <div className="card-info">
                <span className="content-title">Nuevo perfil</span>
              </div>
            </div>
          </div>

          <section className="profile-editor">
            <div className="profile-editor-header">
              <img
                src={previewAvatar}
                alt="Vista previa del avatar"
                className="profile-editor-avatar"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
              <div>
                <h3>{selectedProfile ? 'Editar perfil' : 'Crear perfil'}</h3>
                <p>
                  {selectedProfile
                    ? 'Actualiza el nombre o avatar de tu perfil existente.'
                    : 'Dale un nombre y un avatar para personalizar tu experiencia.'}
                </p>
              </div>
            </div>

            <div className="profile-form-grid">
              <div className="profile-field">
                <label htmlFor="profile-name">Nombre del perfil</label>
                <input
                  id="profile-name"
                  placeholder="Ej. Mauri, Familia, Niños..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="profile-field">
                <label htmlFor="profile-avatar">URL del avatar</label>
                <input
                  id="profile-avatar"
                  placeholder="https://..."
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
                />
              </div>
            </div>

            <div className="profile-actions">
              {selectedProfile ? (
                <>
                  <button type="button" className="profile-btn profile-btn--primary" onClick={handleUpdate}>
                    Guardar cambios
                  </button>
                  <button type="button" className="profile-btn profile-btn--danger" onClick={handleDelete}>
                    Eliminar perfil
                  </button>
                  <button type="button" className="profile-btn profile-btn--ghost" onClick={resetEditor}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="profile-btn profile-btn--primary" onClick={handleCreate}>
                    Crear perfil
                  </button>
                  <button type="button" className="profile-btn profile-btn--ghost" onClick={resetEditor}>
                    Limpiar
                  </button>
                </>
              )}
            </div>
          </section>
        </>
      )}

      <div style={{ marginTop: '40px' }}>
        <button type="button" className="theme-toggle-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
