import React, { useEffect, useState } from 'react';
import { getProfilesByUser } from '../services/profileService';
import { useNavigate } from 'react-router-dom';

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const defaultAvatar = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!storedUser || !storedUser.id_usuario) {
      navigate('/login');
      return;
    }

    getProfilesByUser(storedUser.id_usuario, token)
      .then((data) => {
        const cleanedProfiles = data.map(p => ({
          ...p,
          avatar_url: (p.avatar_url && p.avatar_url.includes('wallpapers.com')) 
            ? defaultAvatar 
            : p.avatar_url
        }));
        setProfiles(cleanedProfiles);
      })
      .catch((err) => {
        console.error("Error al cargar perfiles:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-locoto-bg text-locoto-text">
        <div className="text-2xl animate-pulse font-black tracking-tighter italic text-locoto-primary">
          CARGANDO LOCOTOS...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-locoto-bg p-4 font-sans text-locoto-text">
      <h1 className="mb-16 text-center text-4xl md:text-5xl font-black tracking-tighter">
        {isEditing ? (
          <span className="text-locoto-secondary italic uppercase">ADMINISTRAR PERFILES</span>
        ) : (
          <>¿QUIÉN ESTÁ <span className="text-locoto-primary italic">VIENDO</span> AHORA?</>
        )}
      </h1>
      
      <div className="flex flex-wrap justify-center gap-10">
        {profiles.map((p) => (
          <div key={p.id_perfil} className="group flex flex-col items-center relative">
            
            <div 
              className="relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-transparent transition-all duration-300 group-hover:border-locoto-primary group-hover:scale-105 bg-locoto-div shadow-lg cursor-pointer"
              onClick={() => {
                if (isEditing) {
                  // Modo Edición: Vamos a editar el perfil
                  navigate(`/edit-profile/${p.id_perfil}`);
                } else {
                  // Modo Selección: Guardamos el perfil activo y vamos al catálogo
                  localStorage.setItem('activeProfile', JSON.stringify(p));
                  console.log("Navegando al catálogo con el perfil:", p.nombre);
                  navigate('/catalog'); 
                }
              }}
            >
              <img 
                src={p.avatar_url || defaultAvatar} 
                alt={p.nombre}
                className="h-full w-full object-cover aspect-square block opacity-90 group-hover:opacity-100 transition-opacity" 
                onError={(e) => { e.target.src = defaultAvatar }} 
              />

              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-locoto-bg/60 backdrop-blur-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-locoto-primary bg-locoto-div/50 shadow-neon">
                    <span className="text-locoto-primary text-2xl">✎</span>
                  </div>
                </div>
              )}
            </div>

            <span className="mt-5 text-lg font-bold text-locoto-muted group-hover:text-locoto-primary uppercase tracking-widest transition-colors">
              {p.nombre}
            </span>
          </div>
        ))}

        {/* Botón para crear nuevo perfil */}
        <div 
          className="group flex cursor-pointer flex-col items-center" 
          onClick={() => navigate('/create-profile')}
        >
          <div className="flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-2xl border-4 border-transparent bg-locoto-div/40 transition-all duration-300 group-hover:bg-locoto-div group-hover:border-locoto-secondary group-hover:scale-105">
            <span className="text-6xl text-locoto-muted group-hover:text-locoto-secondary leading-none font-light">+</span>
          </div>
          <span className="mt-5 text-lg font-bold text-locoto-muted group-hover:text-locoto-secondary uppercase tracking-widest transition-colors">
            Nuevo
          </span>
        </div>
      </div>

      <button 
        onClick={() => setIsEditing(!isEditing)}
        className={`mt-20 border-2 px-10 py-3 transition-all duration-300 uppercase tracking-[0.3em] text-xs font-black rounded-xl ${
          isEditing 
            ? 'bg-locoto-primary text-locoto-bg border-locoto-primary shadow-[0_0_15px_rgba(208,226,226,0.4)]' 
            : 'border-locoto-muted text-locoto-muted hover:border-locoto-primary hover:text-locoto-primary'
        }`}
      >
        {isEditing ? 'LISTO' : 'GESTIONAR PERFILES'}
      </button>
    </div>
  );
};

export default ProfilesPage;