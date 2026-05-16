import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Iconos inline SVG para mantener la consistencia
const IconMail     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>;
const IconLock     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconUser     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconArrow    = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>;
const IconSun      = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

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
  const [darkMode, setDarkMode] = useState(true);

  const dm = darkMode;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/verify-email', { state: { email: formData.correo } });
      } else {
        let errorMessage = data.error?.message || "Error al registrar";
        setError(errorMessage);
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative flex min-h-screen items-center justify-center px-4 overflow-hidden font-sans transition-colors duration-500 ${dm ? 'bg-[#1a2d38]' : 'bg-[#fcfcff]'}`}>
      
      {/* Blobs de fondo (Idénticos al login) */}
      <div className={`absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[100px] transition-all duration-700 pointer-events-none ${dm ? 'bg-palette-pink opacity-20' : 'bg-palette-purple opacity-[0.15]'}`} />
      <div className={`absolute top-1/2 -right-32 w-72 h-72 rounded-full blur-[100px] transition-all duration-700 pointer-events-none ${dm ? 'bg-palette-sky opacity-20' : 'bg-palette-pink opacity-[0.12]'}`} />
      <div className={`absolute -bottom-24 -left-12 w-64 h-64 rounded-full blur-[100px] transition-all duration-700 pointer-events-none ${dm ? 'bg-palette-purple opacity-10' : 'bg-palette-sky opacity-[0.1]'}`} />

      {/* Card */}
      <div className={`relative w-full max-w-md rounded-3xl px-8 py-10 transition-all duration-500 ${dm ? 'bg-[rgba(39,73,95,0.55)] backdrop-blur-xl border border-palette-sky/20 shadow-[0_8px_48px_rgba(0,0,0,0.4)]' : 'bg-white border border-palette-purple/20 shadow-[0_4px_40px_rgba(125,126,207,0.12)]'}`}>
        
        {/* Toggle tema */}
        <button type="button" onClick={() => setDarkMode(!dm)} className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${dm ? 'bg-palette-sky/10 text-palette-sky' : 'bg-palette-purple/10 text-palette-deep'}`}>
          {dm ? <IconSun /> : <IconMoon />}
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className={`font-display text-5xl font-extrabold italic tracking-tight leading-none ${dm ? 'text-palette-sky' : 'text-palette-deep'}`}>
            LOCO<span className="text-palette-pink">TOS</span>
          </h1>
          <p className={`text-[0.62rem] font-bold uppercase tracking-[0.35em] mt-1 ${dm ? 'text-palette-sky/40' : 'text-palette-deep/40'}`}>
            Registro de usuario
          </p>
          <p className={`text-xl font-bold mt-5 ${dm ? 'text-palette-white' : 'text-palette-deep'}`}>
            Crea tu cuenta
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] rounded-xl text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className={`flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest mb-2 ${dm ? 'text-palette-sky' : 'text-palette-deep'}`}>
              <IconUser /> Nombre de usuario
            </label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dm ? 'text-palette-sky/40' : 'text-palette-purple/60'}`}>
                <IconUser />
              </span>
              <input
                type="text"
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Mateo_Dev"
                className={`w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm transition-all duration-300 outline-none ${dm ? 'bg-black/20 border border-white/10 text-white placeholder:text-white/20 focus:border-palette-sky' : 'bg-zinc-100/80 border border-gray-200 text-[#08060d] placeholder:text-gray-400 focus:border-palette-purple'}`}
              />
            </div>
          </div>

          {/* Correo */}
          <div>
            <label className={`flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest mb-2 ${dm ? 'text-palette-sky' : 'text-palette-deep'}`}>
              <IconMail /> Correo electrónico
            </label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dm ? 'text-palette-sky/40' : 'text-palette-purple/60'}`}>
                <IconMail />
              </span>
              <input
                type="email"
                name="correo"
                required
                value={formData.correo}
                onChange={handleChange}
                placeholder="usuario@locotos.com"
                className={`w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm transition-all duration-300 outline-none ${dm ? 'bg-black/20 border border-white/10 text-white placeholder:text-white/20 focus:border-palette-sky' : 'bg-zinc-100/80 border border-gray-200 text-[#08060d] placeholder:text-gray-400 focus:border-palette-purple'}`}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className={`flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest mb-2 ${dm ? 'text-palette-sky' : 'text-palette-deep'}`}>
              <IconLock /> Contraseña
            </label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dm ? 'text-palette-sky/40' : 'text-palette-purple/60'}`}>
                <IconLock />
              </span>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm transition-all duration-300 outline-none ${dm ? 'bg-black/20 border border-white/10 text-white placeholder:text-white/20 focus:border-palette-sky' : 'bg-zinc-100/80 border border-gray-200 text-[#08060d] placeholder:text-gray-400 focus:border-palette-purple'}`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-2 rounded-2xl font-display text-xs font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : dm ? 'bg-palette-sky text-palette-deep hover:bg-palette-pink' : 'bg-palette-deep text-palette-white hover:bg-palette-purple'}`}
          >
            {loading ? 'Procesando...' : (<><IconArrow /> Registrarse</>)}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className={`text-xs font-medium transition-colors duration-300 hover:text-palette-pink ${dm ? 'text-white/35' : 'text-palette-deep/50'}`}>
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;