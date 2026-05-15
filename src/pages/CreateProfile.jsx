import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '../services/profileService';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [isKids, setIsKids] = useState(false);
  const [loading, setLoading] = useState(false);

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

      if (result) {
        navigate('/perfiles');
      } else {
        alert("Error al crear. El servidor rechazó los datos.");
      }
    } catch (error) {
      console.error("Error en handleContinue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-locoto-bg text-locoto-text p-6 font-sans">
      <div className="w-full max-w-2xl animate-fadeIn">
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter italic text-locoto-primary uppercase">
          Añadir perfil
        </h1>
        <p className="text-locoto-muted text-lg mb-10 tracking-wide opacity-80">
          Añade un perfil para otra persona que ve Locotos Streaming.
        </p>
        
       
        <div className="flex flex-col md:flex-row items-center gap-10 border-y border-locoto-primary/20 bg-locoto-div/30 p-10 rounded-2xl w-full shadow-2xl">
          
          <div className="h-32 w-32 md:h-40 md:w-40 flex-shrink-0">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
              className="h-full w-full rounded-2xl object-cover border-2 border-locoto-muted/30" 
              alt="avatar" 
            />
          </div>
          
          <div className="flex-1 w-full">
            <input 
              type="text" 
              placeholder="Nombre del perfil" 
              className="bg-zinc-900/60 border border-zinc-800 p-4 text-xl outline-none w-full focus:border-locoto-secondary rounded-xl transition-all text-locoto-text placeholder:text-zinc-700"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
            
            <div className="mt-8 flex items-center gap-4 group cursor-pointer">
              <input 
                type="checkbox" 
                id="kidsCheckbox"
                className="h-6 w-6 accent-locoto-secondary cursor-pointer"
                checked={isKids}
                onChange={(e) => setIsKids(e.target.checked)}
              />
              <label 
                htmlFor="kidsCheckbox" 
                className="text-lg text-locoto-muted group-hover:text-locoto-text cursor-pointer select-none transition-colors uppercase tracking-widest font-bold"
              >
                ¿Es un perfil para niños?
              </label>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-6">
          <button 
            onClick={handleContinue}
            disabled={loading}
            className={`px-12 py-3 font-black text-xs tracking-[0.2em] uppercase rounded-xl transition-all duration-300 ${
              loading 
                ? 'bg-zinc-800 text-zinc-500' 
                : 'bg-locoto-secondary text-locoto-bg hover:bg-locoto-accent hover:shadow-[0_0_20px_rgba(152,216,232,0.3)]'
            }`}
          >
            {loading ? 'GUARDANDO...' : 'CONTINUAR'}
          </button>
          
          <button 
            onClick={() => navigate('/perfiles')}
            className="border-2 border-locoto-muted px-12 py-3 text-locoto-muted text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:border-locoto-primary hover:text-locoto-primary transition-all duration-300"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;