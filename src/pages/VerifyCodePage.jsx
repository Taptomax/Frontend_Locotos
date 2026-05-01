import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyCodePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Obtenemos el correo del paso anterior
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/email/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, code: code }) // Endpoint que vimos en tu Controller
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Cuenta activada con éxito!");
        navigate('/login');
      } else {
        alert(data.error || "Código incorrecto");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form onSubmit={handleVerify} className="w-full max-w-md p-8 bg-zinc-900 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Verifica tu cuenta</h2>
        <p className="text-zinc-400 mb-6 text-center">
          Ingresa el código de 6 dígitos enviado a <br/>
          <span className="text-white font-semibold">{email}</span>
        </p>

        <input
          type="text"
          maxLength="6"
          placeholder="000000"
          className="w-full p-4 mb-6 bg-zinc-800 border border-zinc-700 rounded text-center text-3xl tracking-widest focus:outline-none focus:border-red-600"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-bold transition ${
            loading ? 'bg-zinc-600' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {loading ? 'Verificando...' : 'Confirmar Código'}
        </button>
      </form>
    </div>
  );
};

export default VerifyCodePage;