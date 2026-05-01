import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  // 1. Definimos el estado inicial coincidiendo con tu backend
  const [formData, setFormData] = useState({
  nombre: '',
  correo: '',
  password: '',
  // Deben ser exactamente estas cadenas de texto:
  tipo_usuario: 'CLIENTE', 
  estado: 'PENDIENTE_VERIFICACION' 
});

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 2. Llamada a tu API en el puerto 3000
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirigimos a la nueva pantalla de verificación
        navigate('/verify-email', { state: { email: formData.correo } });
      } else {
        // 3. LÓGICA DE ERROR MEJORADA (Aquí es donde lo pusimos)
        let errorMessage = "Error al registrar";
        
        if (typeof data.error === 'object' && data.error !== null) {
          // Si el backend usa Zod, enviará un array de errores
          if (Array.isArray(data.error)) {
            const detail = data.error[0];
            // Esto te dirá: "Campo 'password': El campo es requerido"
            errorMessage = `Campo "${detail.path[0]}": ${detail.message}`;
          } else {
            errorMessage = data.error.message || JSON.stringify(data.error);
          }
        } else if (typeof data.error === 'string') {
          errorMessage = data.error;
        }

        setError(errorMessage);
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. ¿Está el back encendido?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-red-600 italic">LOCOTOS</h1>
          <p className="text-zinc-400 mt-2 text-sm">Crea tu cuenta para el streaming</p>
        </div>

        {/* Mensaje de error visible */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-500/50 text-red-200 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              required
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-600 transition text-sm"
              placeholder="Tu nombre de usuario"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Correo</label>
            <input
              type="email"
              name="correo"
              required
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-600 transition text-sm"
              placeholder="ejemplo@correo.com"
              value={formData.correo}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-600 transition text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-4 rounded-lg font-bold text-sm tracking-widest transition ${
              loading ? 'bg-zinc-700 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:scale-95'
            }`}
          >
            {loading ? 'CARGANDO...' : 'REGISTRARSE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;