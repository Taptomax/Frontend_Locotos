import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateProfile, deleteProfile } from '../services/profileService';

const IconSun  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const token = localStorage.getItem('token');

  const dm = darkMode;

  useEffect(() => {
    const savedTheme = localStorage.getItem('catalog-theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');
    // Aquí podrías cargar los datos actuales del perfil si tuvieras un getProfileById
  }, []);

  const toggleTheme = () => {
    const newMode = !dm;
    setDarkMode(newMode);
    localStorage.setItem('catalog-theme', newMode ? 'dark' : 'light');
  };

  const handleSave = async () => {
    if (!nombre.trim()) return alert("El nombre no puede estar vacío");
    const res = await updateProfile(id, { nombre: nombre.trim() }, token);
    if (res) navigate('/perfiles');
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este perfil?")) {
      const success = await deleteProfile(id, token);
      if (success) navigate('/perfiles');
      else alert("No se pudo eliminar el perfil");
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center p-6 transition-colors duration-500 font-sans relative overflow-hidden ${dm ? 'bg-[#1a2d38]' : 'bg-[#fcfcff]'}`}>
      
      {/* Background Blobs */}
      <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] transition-opacity duration-700 ${dm ? 'bg-palette-sky opacity-20' : 'bg-palette-purple opacity-10'}`} />
      <div className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-[120px] transition-opacity duration-700 ${dm ? 'bg-palette-pink opacity-20' : 'bg-palette-sky opacity-10'}`} />

      {/* Theme Toggle Button */}
      <button 
        type="button" 
        onClick={toggleTheme} 
        className={`fixed top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center z-50 transition-all hover:scale-110 active:scale-95 ${dm ? 'bg-palette-sky/10 text-palette-sky shadow-lg shadow-black/20' : 'bg-palette-purple/10 text-palette-deep shadow-lg shadow-indigo-100'}`}
      >
        {dm ? <IconSun /> : <IconMoon />}
      </button>

      <div className={`w-full max-w-3xl relative z-10 backdrop-blur-2xl rounded-[3rem] border p-8 md:p-14 shadow-2xl transition-all duration-500 ${dm ? 'bg-[#223e4f]/80 border-white/10' : 'bg-white/80 border-zinc-200'}`}>
        
        {/* Header Section */}
        <div className="mb-12 border-b border-white/5 pb-8">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-2 animate-fade-down">
            <span className={dm ? 'text-palette-sky' : 'text-palette-deep'}>EDITAR</span>
            <span className="text-palette-pink"> PERFIL</span>
          </h1>
          <p className={`text-[10px] uppercase tracking-[0.4em] font-bold opacity-60 ${dm ? 'text-white' : 'text-palette-deep'}`}>
            ID de Perfil: {id}
          </p>
        </div>

        {/* Profile Form Card */}
        <div className={`flex flex-col md:flex-row items-center gap-10 p-8 rounded-[2.5rem] border transition-colors ${dm ? 'bg-black/20 border-white/5' : 'bg-zinc-50/80 border-zinc-200'}`}>
          
          <div className="relative group">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl overflow-hidden border-4 border-palette-sky/30 transition-all group-hover:border-palette-pink shadow-xl relative">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
                className="h-full w-full object-cover" 
                alt="avatar" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-2xl">✎</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-4">
            <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${dm ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Nombre del perfil
            </label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Mateo_Streaming" 
              className={`w-full p-5 text-xl font-bold rounded-2xl border transition-all focus:outline-none focus:ring-4 ${
                dm 
                ? 'bg-[#1a2d38] border-white/10 text-white focus:border-palette-sky focus:ring-palette-sky/20 placeholder:text-white/10' 
                : 'bg-white border-zinc-300 text-palette-deep focus:border-palette-purple focus:ring-palette-purple/10 placeholder:text-zinc-300'
              }`}
              autoFocus
            />
            <p className={`text-[9px] uppercase tracking-widest font-bold px-2 ${dm ? 'text-palette-sky/60' : 'text-palette-purple/60'}`}>
              Configuración de contenido y preferencias
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <button 
            onClick={handleSave}
            className={`px-10 py-4 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-xl ${
              dm 
                ? 'bg-palette-sky text-[#1a2d38] hover:shadow-palette-sky/30 hover:scale-[1.02]' 
                : 'bg-palette-purple text-white hover:shadow-palette-purple/30 hover:scale-[1.02]'
            }`}
          >
            GUARDAR CAMBIOS
          </button>
          
          <button 
            onClick={() => navigate('/perfiles')}
            className={`px-10 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl border-2 transition-all duration-300 ${dm ? 'border-white/10 text-white/50 hover:border-white/40 hover:text-white' : 'border-zinc-200 text-zinc-400 hover:border-palette-deep hover:text-palette-deep'}`}
          >
            CANCELAR
          </button>

          <button 
            onClick={handleDelete}
            className="md:ml-auto px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-500 border-b-2 border-transparent hover:border-red-500 transition-all duration-300"
          >
            ELIMINAR PERFIL
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;