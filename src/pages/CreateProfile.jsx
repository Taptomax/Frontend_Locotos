import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '../services/profileService';

const IconSun  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

const CreateProfile = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [isKids, setIsKids] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const dm = darkMode;

  useEffect(() => {
    const savedTheme = localStorage.getItem('catalog-theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newMode = !dm;
    setDarkMode(newMode);
    localStorage.setItem('catalog-theme', newMode ? 'dark' : 'light');
  };

  const handleContinue = async () => {
    if (!nombre.trim()) {
      alert("Por favor, ingresa un nombre.");
      return;
    }
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      if (!storedUser || !storedUser.id_usuario) {
        navigate('/login');
        return;
      }
      const newProfileData = {
        nombre: nombre.trim(),
        id_usuario: Number(storedUser.id_usuario),
        avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
        id_clasificacion_maxima: isKids ? 1 : 4, 
        idioma_preferido: "es-BO", 
        es_ninos: isKids
      };
      const result = await createProfile(newProfileData, token);
      if (result) navigate('/perfiles');
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center p-6 transition-colors duration-500 font-sans relative overflow-hidden ${dm ? 'bg-[#1a2d38]' : 'bg-[#fcfcff]'}`}>
      
      {/* Fondo Decorativo */}
      <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[120px] transition-opacity duration-700 ${dm ? 'bg-palette-pink opacity-20' : 'bg-palette-purple opacity-10'}`} />
      <div className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-[120px] transition-opacity duration-700 ${dm ? 'bg-palette-sky opacity-20' : 'bg-palette-pink opacity-10'}`} />

      {/* Botón de Modo */}
      <button 
        type="button" 
        onClick={toggleTheme} 
        className={`fixed top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center z-50 transition-all hover:scale-110 active:scale-95 ${dm ? 'bg-palette-sky/10 text-palette-sky shadow-lg shadow-black/20' : 'bg-palette-purple/10 text-palette-deep shadow-lg shadow-indigo-100'}`}
      >
        {dm ? <IconSun /> : <IconMoon />}
      </button>

      <div className={`w-full max-w-3xl relative z-10 backdrop-blur-2xl rounded-[3rem] border p-8 md:p-14 shadow-2xl transition-all duration-500 ${dm ? 'bg-[#223e4f]/80 border-white/10' : 'bg-white/80 border-zinc-200'}`}>
        
        {/* Branding y Título */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 animate-fade-down">
            <span className={dm ? 'text-palette-sky' : 'text-palette-deep'}>AÑADIR</span>
            <span className="text-palette-pink"> PERFIL</span>
          </h1>
          <p className={`text-xs uppercase tracking-[0.3em] font-bold opacity-60 ${dm ? 'text-white' : 'text-palette-deep'}`}>
            Crea una experiencia personalizada en Locotos Streaming
          </p>
        </div>

        {/* Sección de Formulario */}
        <div className={`flex flex-col md:flex-row items-center gap-10 p-8 rounded-[2rem] border transition-colors ${dm ? 'bg-black/20 border-white/5' : 'bg-zinc-50/80 border-zinc-200'}`}>
          
          <div className="relative group">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl overflow-hidden border-4 border-palette-pink/30 transition-transform group-hover:scale-105 shadow-xl">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
                className="h-full w-full object-cover" 
                alt="avatar" 
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-palette-pink p-2 rounded-full shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-6">
            <input 
              type="text" 
              placeholder="Nombre del perfil" 
              className={`w-full p-5 text-xl font-bold rounded-2xl border transition-all focus:outline-none focus:ring-4 ${
                dm 
                ? 'bg-[#1a2d38] border-white/10 text-white focus:border-palette-sky focus:ring-palette-sky/20 placeholder:text-white/10' 
                : 'bg-white border-zinc-300 text-palette-deep focus:border-palette-purple focus:ring-palette-purple/10 placeholder:text-zinc-300'
              }`}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
            
            <label className="flex items-center gap-4 cursor-pointer group w-fit">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={isKids}
                  onChange={(e) => setIsKids(e.target.checked)}
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${dm ? 'bg-white/10' : 'bg-zinc-200'} peer-checked:bg-palette-pink`}></div>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6`}></div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${dm ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-500 group-hover:text-palette-deep'}`}>
                ¿Es un perfil para niños?
              </span>
            </label>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-12 flex flex-wrap gap-4">
          <button 
            onClick={handleContinue}
            disabled={loading}
            className={`flex-1 min-w-[200px] py-4 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-xl ${
              loading 
                ? 'bg-zinc-500 text-white cursor-wait' 
                : dm 
                  ? 'bg-palette-sky text-[#1a2d38] hover:shadow-palette-sky/30 hover:scale-[1.02]' 
                  : 'bg-palette-purple text-white hover:shadow-palette-purple/30 hover:scale-[1.02]'
            }`}
          >
            {loading ? 'GUARDANDO...' : 'GUARDAR PERFIL'}
          </button>
          
          <button 
            onClick={() => navigate('/perfiles')}
            className={`px-10 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl border-2 transition-all duration-300 ${dm ? 'border-white/10 text-white/50 hover:border-white/40 hover:text-white' : 'border-zinc-200 text-zinc-400 hover:border-palette-deep hover:text-palette-deep'}`}
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;