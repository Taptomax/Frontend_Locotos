import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
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
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/verify-email', { state: { email: formData.correo } });
      } else {
        let errorMessage = "Error al registrar";
        
        if (typeof data.error === 'object' && data.error !== null) {
          if (Array.isArray(data.error)) {
            const detail = data.error[0];
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
   
    <div className="flex min-h-screen items-center justify-center bg-locoto-bg text-locoto-text px-4 font-sans">
      
      
      <div className="w-full max-w-md bg-locoto-div p-8 rounded-2xl shadow-2xl border border-locoto-primary/20">
        
        <div className="mb-8 text-center">
         
          <h1 className="text-4xl font-black tracking-tighter text-locoto-primary italic">LOCOTOS</h1>
        
          <p className="text-locoto-muted mt-2 text-xs uppercase tracking-widest opacity-80">Crea tu cuenta para el streaming</p>
        </div>

    
        {error && (
          <div className="mb-6 p-3 bg-red-900/10 border border-red-500/30 text-red-300 text-xs rounded-lg text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
          
            <label className="block text-[10px] font-bold text-locoto-muted uppercase tracking-widest mb-2 ml-1">Nombre de usuario</label>
            <input
              type="text"
              name="nombre"
              required
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-locoto-secondary transition-all text-sm text-locoto-text placeholder:text-zinc-700"
              placeholder="Ej. Mateo_Dev"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-locoto-muted uppercase tracking-widest mb-2 ml-1">Correo electrónico</label>
            <input
              type="email"
              name="correo"
              required
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-locoto-secondary transition-all text-sm text-locoto-text placeholder:text-zinc-700"
              placeholder="mateo@locotos.com"
              value={formData.correo}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-locoto-muted uppercase tracking-widest mb-2 ml-1">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-locoto-secondary transition-all text-sm text-locoto-text placeholder:text-zinc-700"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

         
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-4 rounded-xl font-black text-xs tracking-[0.2em] transition-all duration-300 ${
              loading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-locoto-secondary text-locoto-bg hover:bg-locoto-accent hover:shadow-[0_0_20px_rgba(152,216,232,0.3)] active:scale-95'
            }`}
          >
            {loading ? 'PROCESANDO...' : 'REGISTRARSE'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-[10px] text-zinc-600 uppercase tracking-tight">
          © 2026 LOCOTOS Streaming Project
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;