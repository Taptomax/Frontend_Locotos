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

      // AJUSTE FINAL SEGÚN EL ERROR DE VALIDACIÓN:
      const newProfileData = {
        nombre: nombre.trim(),
        id_usuario: Number(storedUser.id_usuario),
        avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
        
        // Clasificación 4 para adultos (el máximo permitido)
        id_clasificacion_maxima: isKids ? 1 : 4, 
        
        // CORRECCIÓN: Usamos el formato exacto que pide el backend (es-BO)
        idioma_preferido: "es-BO", 
        
        es_ninos: isKids
      };

      console.log("Enviando datos validados:", newProfileData);

      const result = await createProfile(newProfileData, token);

      if (result) {
        console.log("¡Éxito! Perfil creado.");
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
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-netflixBlack text-white p-6">
      <div className="w-full max-w-2xl animate-fadeIn">
        <h1 className="text-4xl md:text-6xl font-medium mb-4">Añadir perfil</h1>
        <p className="text-gray-400 text-lg mb-8">Añade un perfil para otra persona que ve Locotos Streaming.</p>
        
        <div className="flex flex-col md:flex-row items-center gap-8 border-y border-gray-700 py-10 w-full">
          <div className="h-32 w-32 md:h-40 md:w-40 flex-shrink-0">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" className="h-full w-full rounded object-cover" alt="avatar" />
          </div>
          
          <div className="flex-1 w-full">
            <input 
              type="text" 
              placeholder="Nombre" 
              className="bg-gray-600 p-3 text-xl outline-none w-full focus:bg-gray-500 transition-colors"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
            
            <div className="mt-6 flex items-center gap-3">
              <input 
                type="checkbox" 
                id="kidsCheckbox"
                className="h-6 w-6 accent-netflixRed cursor-pointer"
                checked={isKids}
                onChange={(e) => setIsKids(e.target.checked)}
              />
              <label htmlFor="kidsCheckbox" className="text-xl text-gray-300 cursor-pointer select-none">
                ¿Es un perfil para niños?
              </label>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-6">
          <button 
            onClick={handleContinue}
            disabled={loading}
            className={`bg-white text-black px-10 py-2 font-bold text-lg uppercase transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-netflixRed hover:text-white'}`}
          >
            {loading ? 'Guardando...' : 'Continuar'}
          </button>
          
          <button 
            onClick={() => navigate('/perfiles')}
            className="border border-gray-500 px-10 py-2 text-gray-500 text-lg uppercase hover:border-white hover:text-white transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;