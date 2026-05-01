import React, { useEffect, useState } from 'react';
import { getProfilesByUser } from '../services/profileService';
import { useNavigate } from 'react-router-dom';

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Avatar oficial de Netflix que sí se adapta bien
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
        // FILTRO DE SEGURIDAD: 
        // Si la URL es la de la imagen roja gigante (wallpapers.com), la cambiamos por la default
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
      <div className="flex h-screen w-screen items-center justify-center bg-netflixBlack text-white">
        <div className="text-2xl animate-pulse font-medium">Cargando perfiles...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-netflixBlack p-4">
      <h1 className="mb-12 text-center text-4xl md:text-5xl text-white font-medium">
        {isEditing ? 'Administrar perfiles:' : '¿Quién está viendo ahora?'}
      </h1>
      
      <div className="flex flex-wrap justify-center gap-8">
        {profiles.map((p) => (
          <div key={p.id_perfil} className="group flex cursor-pointer flex-col items-center relative">
            
            {/* CONTENEDOR CON TAMAÑO BLINDADO */}
            <div 
              className="relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0 overflow-hidden rounded-md border-4 border-transparent transition group-hover:border-white group-hover:scale-105 bg-gray-700"
              onClick={() => isEditing ? navigate(`/edit-profile/${p.id_perfil}`) : console.log(`Entrando como ${p.nombre}`)}
            >
              <img 
                src={p.avatar_url || defaultAvatar} 
                alt={p.nombre}
                className="h-full w-full object-cover aspect-square block" 
                onError={(e) => { e.target.src = defaultAvatar }} 
              />

              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-black/30">
                    <span className="text-white text-2xl">✎</span>
                  </div>
                </div>
              )}
            </div>

            <span className="mt-4 text-xl text-gray-400 group-hover:text-white transition-colors">
              {p.nombre}
            </span>
          </div>
        ))}

        {/* BOTÓN AÑADIR PERFIL */}
        <div 
          className="group flex cursor-pointer flex-col items-center" 
          onClick={() => navigate('/create-profile')}
        >
          <div className="flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-md border-4 border-transparent bg-gray-800 transition group-hover:bg-gray-700 group-hover:border-white">
            <span className="text-6xl text-gray-500 group-hover:text-white leading-none">+</span>
          </div>
          <span className="mt-4 text-xl text-gray-400 group-hover:text-white transition-colors">
            Añadir perfil
          </span>
        </div>
      </div>

      <button 
        onClick={() => setIsEditing(!isEditing)}
        className={`mt-16 border px-8 py-2 transition-all uppercase tracking-widest text-sm font-bold ${
          isEditing 
            ? 'bg-white text-black border-white' 
            : 'border-gray-500 text-gray-500 hover:border-white hover:text-white'
        }`}
      >
        {isEditing ? 'Listo' : 'Administrar perfiles'}
      </button>
    </div>
  );
};

export default ProfilesPage;