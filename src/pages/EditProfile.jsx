import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateProfile, deleteProfile } from '../services/profileService';

const EditProfile = () => {
  const { id } = useParams(); // Agarramos el ID de la URL
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const token = localStorage.getItem('token');

  const handleSave = async () => {
    if (!nombre.trim()) return alert("El nombre no puede estar vacío");
    
    const res = await updateProfile(id, { nombre }, token);
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
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-netflixBlack text-white p-4">
      <div className="w-full max-w-xl">
        <h1 className="text-5xl font-medium mb-8 border-b border-gray-700 pb-4">Editar perfil</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-8 py-8">
          {/* Avatar estático por ahora */}
          <div className="relative group">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
              className="h-32 w-32 md:h-40 md:w-40 rounded" 
              alt="avatar" 
            />
            <div className="absolute bottom-2 left-2 bg-black/60 p-1 rounded-full border border-white">
              <span className="text-xs">✎</span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del perfil" 
              className="bg-gray-600 p-3 text-xl outline-none w-full mb-4 focus:bg-gray-500 transition-colors"
            />
            <p className="text-gray-400 text-sm">Configuración de idioma y restricciones...</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-gray-700">
          <button 
            onClick={handleSave}
            className="bg-white text-black px-8 py-2 font-bold hover:bg-netflixRed hover:text-white transition uppercase"
          >
            Guardar
          </button>
          
          <button 
            onClick={() => navigate('/perfiles')}
            className="border border-gray-500 px-8 py-2 text-gray-500 hover:border-white hover:text-white transition uppercase"
          >
            Cancelar
          </button>

          <button 
            onClick={handleDelete}
            className="border border-red-600 px-8 py-2 text-red-600 hover:bg-red-600 hover:text-white transition uppercase ml-auto"
          >
            Eliminar perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;