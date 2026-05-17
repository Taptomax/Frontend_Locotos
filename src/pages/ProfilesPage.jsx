import React, { useEffect, useState } from 'react';
import { getProfilesByUser } from '../services/profileService';
import { useNavigate } from 'react-router-dom';


const IconSun  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconEdit = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const dm = darkMode;
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
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className={`flex h-screen w-screen items-center justify-center transition-colors duration-500 ${dm ? 'bg-[#1a2d38]' : 'bg-[#fcfcff]'}`}>
        <div className={`text-3xl animate-pulse font-display font-black italic tracking-tighter ${dm ? 'text-palette-sky' : 'text-palette-deep'}`}>
          CARGANDO LOCO<span className="text-palette-pink">TOS</span>...
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden font-sans transition-colors duration-500 ${dm ? 'bg-[#1a2d38]' : 'bg-[#fcfcff]'}`}>
      
      {/* Blobs de fondo */}
      <div className={`absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[100px] transition-all duration-700 pointer-events-none ${dm ? 'bg-palette-pink opacity-20' : 'bg-palette-purple opacity-[0.15]'}`} />
      <div className={`absolute top-1/2 -right-32 w-72 h-72 rounded-full blur-[100px] transition-all duration-700 pointer-events-none ${dm ? 'bg-palette-sky opacity-20' : 'bg-palette-pink opacity-[0.12]'}`} />

      {/* Toggle tema */}
      <button 
        type="button" 
        onClick={() => setDarkMode(!dm)} 
        className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 ${dm ? 'bg-palette-sky/10 text-palette-sky' : 'bg-palette-purple/10 text-palette-deep'}`}
      >
        {dm ? <IconSun /> : <IconMoon />}
      </button>

      {/* Título Principal */}
      <h1 className={`relative mb-16 text-center text-4xl md:text-5xl font-display font-extrabold tracking-tight animate-fade-down ${dm ? 'text-white' : 'text-palette-deep'}`}>
        {isEditing ? (
          <span className="text-palette-pink italic uppercase">Administrar Perfiles</span>
        ) : (
          <>¿Quién está <span className="text-palette-pink italic">viendo</span> ahora?</>
        )}
      </h1>
      
      {/* Contenedor de Perfiles */}
      <div className="relative flex flex-wrap justify-center gap-8 md:gap-12 max-w-5xl">
        {profiles.map((p) => (
          <div key={p.id_perfil} className="group flex flex-col items-center">
            <div 
              className={`
                relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0 overflow-hidden rounded-3xl border-4 transition-all duration-500 cursor-pointer
                ${dm 
                  ? 'border-transparent group-hover:border-palette-sky shadow-2xl' 
                  : 'border-transparent group-hover:border-palette-purple shadow-xl'}
                group-hover:scale-110 group-active:scale-95
              `}
              onClick={() => {
                if (isEditing) navigate(`/edit-profile/${p.id_perfil}`);
                else {
                  localStorage.setItem('activeProfile', JSON.stringify(p));
                  navigate('/catalog'); 
                }
              }}
            >
              <img 
                src={p.avatar_url || defaultAvatar} 
                alt={p.nombre}
                className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80" 
                onError={(e) => { e.target.src = defaultAvatar }} 
              />

              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white/20 text-white shadow-lg`}>
                    <IconEdit />
                  </div>
                </div>
              )}
            </div>

            <span className={`mt-5 text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${dm ? 'text-white/40 group-hover:text-palette-sky' : 'text-palette-deep/40 group-hover:text-palette-purple'}`}>
              {p.nombre}
            </span>
          </div>
        ))}

        {/* Botón para crear nuevo perfil */}
        <div 
          className="group flex cursor-pointer flex-col items-center" 
          onClick={() => navigate('/create-profile')}
        >
          <div className={`
            flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-3xl border-4 border-dashed transition-all duration-500
            ${dm 
              ? 'bg-black/20 border-white/10 group-hover:border-palette-pink group-hover:bg-black/40' 
              : 'bg-zinc-100 border-zinc-300 group-hover:border-palette-pink group-hover:bg-zinc-200'}
            group-hover:scale-110
          `}>
            <span className={`text-5xl font-light transition-colors ${dm ? 'text-white/20 group-hover:text-palette-pink' : 'text-zinc-400 group-hover:text-palette-pink'}`}>+</span>
          </div>
          <span className={`mt-5 text-sm font-bold uppercase tracking-[0.2em] transition-colors ${dm ? 'text-white/40 group-hover:text-palette-pink' : 'text-palette-deep/40 group-hover:text-palette-pink'}`}>
            Nuevo
          </span>
        </div>
      </div>

      {/* Botón de Gestión */}
      <button 
        onClick={() => setIsEditing(!isEditing)}
        className={`
          mt-20 px-10 py-3.5 transition-all duration-500 uppercase tracking-[0.3em] text-[10px] font-bold rounded-2xl border-2
          ${isEditing 
            ? 'bg-palette-pink border-palette-pink text-white shadow-[0_8px_20px_rgba(225,130,203,0.3)]' 
            : dm 
              ? 'border-white/10 text-white/40 hover:border-palette-sky hover:text-palette-sky' 
              : 'border-zinc-200 text-palette-deep/40 hover:border-palette-purple hover:text-palette-purple'}
        `}
      >
        {isEditing ? 'LISTO' : 'GESTIONAR PERFILES'}
      </button>
    </div>
  );
};

export default ProfilesPage;