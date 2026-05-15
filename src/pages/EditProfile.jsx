import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateProfile, deleteProfile } from '../services/profileService';

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const token = localStorage.getItem('token');

  const handleSave = async () => {
    if (!nombre.trim()) return alert("El nombre no puede estar vacío");
    
    const res = await updateProfile(id, { nombre: nombre.trim() }, token);
    if (res) {
      navigate('/perfiles');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este perfil?")) {
      const success = await deleteProfile(id, token);
      if (success) {
        navigate('/perfiles');
      } else {
        alert("No se pudo eliminar el perfil");
      }
    }
  };

  return (
    
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-locoto-bg text-locoto-text p-6 font-sans">
      <div className="w-full max-w-2xl animate-fadeIn">
        
        <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter italic text-locoto-primary uppercase border-b border-locoto-primary/20 pb-6">
          Editar perfil
        </h1>
        
        <div className="flex flex-col md:flex-row items-center gap-10 py-10 bg-locoto-div/30 rounded-2xl p-8 shadow-2xl border border-locoto-primary/10">
          
          <div className="relative group cursor-pointer">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
              className="h-32 w-32 md:h-40 md:w-40 rounded-2xl object-cover border-2 border-locoto-primary/30 group-hover:border-locoto-secondary transition-all" 
              alt="avatar" 
            />
            <div className="absolute -bottom-2 -right-2 bg-locoto-secondary p-2 rounded-full border-2 border-locoto-bg shadow-lg">
              <span className="text-locoto-bg text-sm font-bold">✎</span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold text-locoto-muted uppercase tracking-widest mb-3 ml-1">Nombre del perfil</label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Mateo_Streaming" 
              className="bg-zinc-900/60 border border-zinc-800 p-4 text-xl outline-none w-full mb-6 focus:border-locoto-secondary rounded-xl transition-all text-locoto-text"
            />
            <p className="text-locoto-muted text-xs uppercase tracking-wider opacity-60">Configuración avanzada de contenido</p>
          </div>
        </div>

        {/* Acciones de pie de página */}
        <div className="flex flex-wrap items-center gap-6 mt-10 pt-10 border-t border-locoto-primary/20">
          <button 
            onClick={handleSave}
            className="bg-locoto-secondary text-locoto-bg px-10 py-3 font-black text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-locoto-accent transition-all duration-300 shadow-neon-sm"
          >
            GUARDAR
          </button>
          
          <button 
            onClick={() => navigate('/perfiles')}
            className="border-2 border-locoto-muted px-10 py-3 text-locoto-muted text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:border-locoto-primary hover:text-locoto-primary transition-all duration-300"
          >
            CANCELAR
          </button>

          <button 
            onClick={handleDelete}
            className="border-2 border-red-500/50 px-10 py-3 text-red-400 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-500/10 hover:border-red-500 transition-all duration-300 ml-auto"
          >
            ELIMINAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;