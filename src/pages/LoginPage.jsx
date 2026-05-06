import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = await loginUser(correo, password);

    if (data && data.token) {
      localStorage.setItem('token', data.token);
      const userToSave = data.user || data.usuario || data; 
      localStorage.setItem('user', JSON.stringify(userToSave));
      navigate('/perfiles'); 
    } else {
      const errorMsg = data.message || data.error || "Correo o contraseña incorrectos";
      alert("Error: " + (typeof errorMsg === 'object' ? 'Revisa los campos' : errorMsg));
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-locoto-bg text-locoto-text px-4 font-sans">
    
      <div className="w-full max-w-md bg-locoto-div p-10 rounded-2xl shadow-2xl border border-locoto-primary/20">
        
        <div className="mb-10 text-center">
          
          <h1 className="text-4xl font-black tracking-tighter text-locoto-primary italic">LOCOTOS</h1>
          
      
          <p className="text-3xl font-bold text-locoto-text mt-4 tracking-tight">
            ¡Bienvenido de nuevo!
          </p>
          <p className="text-locoto-muted mt-1 text-[10px] uppercase tracking-[0.3em] opacity-60">
            Ingresa a tu panel de control
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-locoto-muted uppercase tracking-widest mb-2 ml-1">
              Correo electrónico
            </label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-locoto-secondary transition-all text-sm text-locoto-text placeholder:text-zinc-700"
              placeholder="mateo@locotos.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-locoto-muted uppercase tracking-widest mb-2 ml-1">
              Contraseña
            </label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:border-locoto-secondary transition-all text-sm text-locoto-text placeholder:text-zinc-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'CONECTANDO...' : 'INICIAR SESIÓN'}
          </button>
          
          <div className="mt-8 flex flex-col items-center gap-4 text-[10px] uppercase tracking-widest">
            <Link 
              to="/register" 
              className="text-locoto-text hover:text-locoto-primary transition-colors duration-300 underline underline-offset-4"
            >
              ¿No tienes cuenta? Regístrate
            </Link>
            
            <label className="flex items-center cursor-pointer text-locoto-muted opacity-60 hover:opacity-100 transition-opacity">
              <input type="checkbox" className="mr-2 accent-locoto-secondary" /> 
              Recordar mi sesión
            </label>
          </div>
        </form>

        <p className="mt-10 text-center text-[9px] text-zinc-500 uppercase tracking-tighter opacity-50">
          Acceso Restringido - LOCOTOS Infraestructure
        </p>
      </div>
    </div>
  );
};

export default LoginPage;