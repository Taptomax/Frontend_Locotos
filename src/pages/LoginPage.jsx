import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // necesario para el axios que agregue recien xd

const IconMail    = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>;
const IconLock    = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconEye     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconArrow   = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>;
const IconSun     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const IconMoon    = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconUserPlus= () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [correo, setCorreo]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = await loginUser(correo, password);

    if (data && data.token) {
      const userToSave = data.user || data.usuario || data;

      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userToSave));

      
      try {
        const res = await axios.get(`http://localhost:3002/api/suscriptions/status/${userToSave.id_usuario}`);
        

        if (res.data.tiene_acceso === true) {
          navigate('/perfiles');
        } else {
          navigate('/subscription/plans');
        }
      } catch (error) {
        console.error("Error al validar suscripción:", error);
        navigate('/subscription/plans');
      }

    } else {
      const errorMsg = data.message || data.error || 'Correo o contraseña incorrectos';
      alert('Error: ' + (typeof errorMsg === 'object' ? 'Revisa los campos' : errorMsg));
    }

    setLoading(false);
  };

  const dm = darkMode;

  return (
    <div className={`
      relative flex min-h-screen items-center justify-center px-4 overflow-hidden font-sans transition-colors duration-500
      ${dm ? 'bg-[#1a2d38]' : 'bg-[#fcfcff]'}
    `}>

      {/* Card */}
      <div className={`
        relative w-full max-w-md rounded-3xl px-8 py-10 transition-all duration-500
        ${dm
          ? 'bg-[rgba(39,73,95,0.55)] backdrop-blur-xl border border-palette-sky/20'
          : 'bg-white border border-palette-purple/20'
        }
      `}>

        {/* Toggle */}
        <button onClick={() => setDarkMode(!dm)}>
          {dm ? <IconSun /> : <IconMoon />}
        </button>

        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            placeholder="correo"
          />

          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="password"
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Conectando...' : 'Login'}
          </button>

        </form>

        <Link to="/register">
          <IconUserPlus /> Registrarse
        </Link>

      </div>
    </div>
  );
};

export default LoginPage;