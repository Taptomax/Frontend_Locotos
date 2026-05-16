import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const IconSun  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

const VerifyCodePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "usuario@locotos.com"; 
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const dm = darkMode;

  // Sincronizar tema con localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('catalog-theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newMode = !dm;
    setDarkMode(newMode);
    localStorage.setItem('catalog-theme', newMode ? 'dark' : 'light');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/email/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, code: code }) 
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        alert(data.error || "Código incorrecto");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 transition-colors duration-500 font-sans overflow-hidden relative ${dm ? 'bg-[#1a2d38]' : 'bg-[#fcfcff]'}`}>
      
      {/* Blobs de fondo */}
      <div className={`absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[100px] transition-opacity duration-700 ${dm ? 'bg-palette-pink opacity-20' : 'bg-palette-purple opacity-[0.15]'}`} />
      <div className={`absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-[100px] transition-opacity duration-700 ${dm ? 'bg-palette-sky opacity-20' : 'bg-palette-pink opacity-[0.12]'}`} />

      {/* Botón de Modo idéntico */}
      <button 
        type="button" 
        onClick={toggleTheme} 
        className={`fixed top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center z-50 transition-all hover:scale-110 ${dm ? 'bg-palette-sky/10 text-palette-sky' : 'bg-palette-purple/10 text-palette-deep'}`}
      >
        {dm ? <IconSun /> : <IconMoon />}
      </button>

      <div className={`w-full max-w-md relative z-10 backdrop-blur-xl rounded-[2.5rem] border p-10 shadow-2xl transition-all duration-500 ${dm ? 'bg-[#223e4f]/80 border-white/10' : 'bg-white/80 border-zinc-200'}`}>
        
        {/* Branding */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black italic tracking-tighter mb-2 animate-fade-down">
            <span className={dm ? 'text-palette-sky' : 'text-palette-deep'}>LOCO</span>
            <span className="text-palette-pink">TOS</span>
          </h1>
          <p className={`text-[10px] uppercase tracking-[0.4em] font-bold opacity-60 ${dm ? 'text-white' : 'text-palette-deep'}`}>
            Verificación de Seguridad
          </p>
        </div>

        <div className="text-center mb-8">
          <h2 className={`text-xl font-bold mb-2 ${dm ? 'text-white' : 'text-palette-deep'}`}>Revisa tu correo</h2>
          <p className={`text-sm opacity-70 ${dm ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Ingresa el código enviado a:<br/>
            <span className={`font-bold ${dm ? 'text-palette-sky' : 'text-palette-purple'}`}>{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              maxLength="6"
              placeholder="000000"
              className={`w-full p-5 rounded-2xl text-center text-4xl tracking-[0.3em] font-black focus:outline-none focus:ring-2 transition-all ${
                dm 
                ? 'bg-black/20 border-white/5 text-palette-sky focus:ring-palette-sky/50 placeholder:text-white/5' 
                : 'bg-zinc-100 border-zinc-200 text-palette-purple focus:ring-palette-purple/30 placeholder:text-zinc-300'
              }`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
              loading 
                ? 'bg-zinc-500 cursor-not-allowed' 
                : dm 
                  ? 'bg-palette-sky text-[#1a2d38] hover:shadow-palette-sky/20 hover:scale-[1.02]' 
                  : 'bg-palette-purple text-white hover:shadow-palette-purple/20 hover:scale-[1.02]'
            }`}
          >
            {loading ? (
              <span className="animate-pulse">Verificando...</span>
            ) : (
              <>
                <span>Confirmar Cuenta</span>
                <span className="text-lg">→</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => navigate('/register')}
            className={`text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity ${dm ? 'text-white' : 'text-palette-deep'}`}
          >
            ¿No recibiste el código? Reintentar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;