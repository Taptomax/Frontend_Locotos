import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

// Iconos inline SVG simples (no requieren dependencia extra)
const IconMail    = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>;
const IconLock    = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconEye     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconArrow   = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>;
const IconSun     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon    = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconShield  = () => <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconUserPlus= () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo]       = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [darkMode, setDarkMode]   = useState(true);

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
      const errorMsg = data.message || data.error || 'Correo o contraseña incorrectos';
      alert('Error: ' + (typeof errorMsg === 'object' ? 'Revisa los campos' : errorMsg));
    }
    setLoading(false);
  };

  // Clases condicionales según el modo
  const dm = darkMode;

  return (
    <div className={`
      relative flex min-h-screen items-center justify-center px-4 overflow-hidden font-sans transition-colors duration-500
      ${dm ? 'bg-[#1a2d38]' : 'bg-[#fcfcff]'}
    `}>

      {/* Blobs de fondo */}
      <div className={`
        absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[100px] transition-all duration-700 pointer-events-none
        ${dm 
          ? 'bg-palette-pink opacity-20' 
          : 'bg-palette-purple opacity-[0.15]'}
      `} />

      <div className={`
        absolute top-1/2 -right-32 w-72 h-72 rounded-full blur-[100px] transition-all duration-700 pointer-events-none
        ${dm 
          ? 'bg-palette-sky opacity-20' 
          : 'bg-palette-pink opacity-[0.12]'}
      `} />

      <div className={`
        absolute -bottom-24 -left-12 w-64 h-64 rounded-full blur-[100px] transition-all duration-700 pointer-events-none
        ${dm 
          ? 'bg-palette-purple opacity-10' 
          : 'bg-palette-sky opacity-[0.1]'}
      `} />

      {/* Card */}
      <div className={`
        relative w-full max-w-md rounded-3xl px-8 py-10 animate-fade-up transition-all duration-500
        ${dm
          ? 'bg-[rgba(39,73,95,0.55)] backdrop-blur-xl border border-palette-sky/20 shadow-[0_8px_48px_rgba(0,0,0,0.4)]'
          : 'bg-white border border-palette-purple/20 shadow-[0_4px_40px_rgba(125,126,207,0.12)]'
        }
      `}>

        {/* Toggle tema */}
        <button
          type="button"
          onClick={() => setDarkMode(!dm)}
          className={`
            absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
            ${dm
              ? 'bg-palette-sky/10 text-palette-sky hover:bg-palette-sky/20'
              : 'bg-palette-purple/10 text-palette-deep hover:bg-palette-purple/20'
            }
          `}
          aria-label="Cambiar tema"
        >
          {dm ? <IconSun /> : <IconMoon />}
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className={`font-display text-5xl font-extrabold italic tracking-tight leading-none ${dm ? 'text-palette-sky' : 'text-palette-deep'}`}>
            LOCO<span className="text-palette-pink">TOS</span>
          </h1>
          <p className={`text-[0.62rem] font-bold uppercase tracking-[0.35em] mt-1 ${dm ? 'text-palette-sky/40' : 'text-palette-deep/40'}`}>
            Panel de control
          </p>
          <p className={`text-xl font-bold mt-5 ${dm ? 'text-palette-white' : 'text-palette-deep'}`}>
            ¡Bienvenido de nuevo!
          </p>
          <p className={`text-sm mt-1 ${dm ? 'text-palette-white/40' : 'text-palette-deep/50'}`}>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">

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
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="usuario@locotos.com"
                className={`
                  w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm transition-all duration-300 outline-none
                  ${dm
                    ? 'bg-black/20 border border-locoto-primary/10 text-locoto-text placeholder:text-locoto-text/20 focus:border-locoto-accent focus:bg-black/40 focus:ring-4 focus:ring-locoto-accent/5'
                    : 'bg-zinc-100/50 border border-locoto-border text-palette-deep placeholder:text-zinc-400 focus:border-locoto-primary focus:ring-4 focus:ring-locoto-primary/5'
                  }
                `}
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
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`
                  w-full pl-10 pr-11 py-3.5 rounded-2xl text-sm transition-all duration-300 outline-none
                  ${dm
                    ? 'bg-black/30 border border-palette-sky/15 text-palette-white placeholder:text-white/20 focus:border-palette-sky focus:ring-2 focus:ring-palette-sky/10'
                    : 'bg-[#F5F7FF] border border-palette-purple/20 text-palette-deep placeholder:text-palette-deep/25 focus:border-palette-purple focus:ring-2 focus:ring-palette-purple/10'
                  }
                `}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-palette-pink ${dm ? 'text-palette-sky/40' : 'text-palette-purple/50'}`}
                aria-label="Mostrar u ocultar contraseña"
              >
                {showPass ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          {/* Recordar sesión */}
          <label className={`flex items-center gap-2 text-xs cursor-pointer select-none ${dm ? 'text-palette-white/40' : 'text-palette-deep/50'}`}>
            <input type="checkbox" className="accent-palette-sky w-3.5 h-3.5 cursor-pointer" />
            Recordar mi sesión
          </label>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-4 mt-2 rounded-2xl font-display text-xs font-bold tracking-[0.18em] uppercase
              flex items-center justify-center gap-2 transition-all duration-300
              ${loading
                ? 'cursor-not-allowed opacity-50 bg-gray-500 text-gray-300'
                : dm
                  ? 'bg-palette-sky text-palette-deep hover:bg-palette-pink hover:shadow-[0_8px_24px_rgba(225,130,203,0.3)] active:scale-[0.98]'
                  : 'bg-palette-deep text-palette-white hover:bg-palette-purple hover:shadow-[0_8px_24px_rgba(125,126,207,0.3)] active:scale-[0.98]'
              }
            `}
          >
            {loading ? 'Conectando...' : (<><IconArrow /> Iniciar sesión</>)}
          </button>
        </form>

        {/* Divisor */}
        <div className="flex items-center gap-3 my-6">
          <div className={`flex-1 h-px ${dm ? 'bg-palette-sky/10' : 'bg-palette-purple/12'}`} />
          <span className={`text-[0.62rem] font-semibold uppercase tracking-widest ${dm ? 'text-white/20' : 'text-palette-deep/30'}`}>opciones</span>
          <div className={`flex-1 h-px ${dm ? 'bg-palette-sky/10' : 'bg-palette-purple/12'}`} />
        </div>

        {/* Links */}
        <div className="flex flex-col items-center gap-4">
          <Link
            to="/register"
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-300 hover:text-palette-pink ${dm ? 'text-white/35' : 'text-palette-deep/50'}`}
          >
            <IconUserPlus /> ¿No tienes cuenta? Regístrate
          </Link>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;