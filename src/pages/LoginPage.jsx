import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Intentando login con:", { correo, password });
    
    const data = await loginUser(correo, password);

    // TESTIGO: Para ver qué nos manda Andresito realmente
    console.log("Respuesta completa del servidor:", data);

    // Si Andresito devuelve un token, la sesión es válida
    if (data && data.token) {
      // 1. Guardamos el token (la llave de acceso)
      localStorage.setItem('token', data.token);
      
      // 2. LINEA CLAVE: Guardamos los datos del usuario para el guardia de perfiles
      // Verificamos si los datos vienen en 'user' o en 'usuario'
      const userToSave = data.user || data.usuario || data; 
      localStorage.setItem('user', JSON.stringify(userToSave));

      console.log("¡Sesión y usuario guardados correctamente!");
      
      alert("¡Acceso concedido! Entrando a Locotos Streaming...");
      navigate('/perfiles'); 
    } else {
      // Si hay error, intentamos mostrar el mensaje que viene del servidor
      const errorMsg = data.message || data.error || "Correo o contraseña incorrectos";
      alert("Error de inicio de sesión: " + (typeof errorMsg === 'object' ? 'Revisa los campos' : errorMsg));
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f636863a-330d-4ef4-9d53-93f412089d8d/BO-es-20220502-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60"></div>
      
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
        alt="Netflix Logo" 
        className="absolute left-10 top-10 w-44"
      />

      <div className="relative flex h-full items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-black/75 p-10 shadow-xl border border-gray-800">
          <h1 className="mb-8 text-3xl font-bold text-white">Iniciar sesión</h1>
          
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            className="mb-4 w-full rounded bg-[#333] p-3 text-white outline-none focus:ring-2 focus:ring-gray-500"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="mb-8 w-full rounded bg-[#333] p-3 text-white outline-none focus:ring-2 focus:ring-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="w-full rounded bg-netflixRed py-3 font-bold text-white transition hover:bg-red-700">
            Iniciar sesión
          </button>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2" /> Recuérdame
            </label>
            <Link to="/register" className="hover:underline text-white">Crear cuenta nueva</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;