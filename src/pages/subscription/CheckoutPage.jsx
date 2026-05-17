import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [tipoMetodo, setTipoMetodo] = useState('Tarjeta de Crédito');
  const [proveedor, setProveedor] = useState('Visa');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) return navigate('/login');

    try {
      // Paso 1: Registrar el Método de Pago Simulado incluyendo el prefijo /suscriptions [cite: 4, 5, 54]
      const mpRes = await axios.post('http://localhost:3001/api/suscriptions/metodos-pago', {
        id_usuario: Number(storedUser.id_usuario),
        tipo_metodo: tipoMetodo,
        proveedor: proveedor
      });

      const idMetodoCreado = mpRes.data.metodo_pago.id_metodo; 

      // Paso 2: Crear la Suscripción amarrada al Método de Pago incluyendo el prefijo /suscriptions [cite: 4, 5, 79]
      await axios.post('http://localhost:3001/api/suscriptions/suscribir', {
        id_usuario: Number(storedUser.id_usuario),
        id_plan: Number(planId),
        id_metodo_pago: idMetodoCreado
      });

      alert("¡Suscripción simulada con éxito! Bienvenido a Los Locotos Streaming.");
      navigate('/perfiles'); // Ya tiene acceso, directo a los perfiles
    } catch (error) {
      console.error("Error en el flujo de facturación:", error);
      alert(error.response?.data?.message || "Error al procesar el pago estructurado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#27495F] flex items-center justify-center p-6 text-[#FAFBFD]">
      <div className="bg-[#1f3a4a] border border-[#3a5a6f] p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-black mb-6 uppercase text-[#8AD5DF] italic">Método de Pago Simulado</h2>
        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-2">Tipo de Medio</label>
            <select 
              value={tipoMetodo} 
              onChange={(e) => setTipoMetodo(e.target.value)}
              className="w-full bg-[#27495F] border border-[#3a5a6f] p-3 rounded-xl outline-none focus:border-[#E182CB]"
            >
              <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
              <option value="PayPal">PayPal</option>
              <option value="QR">Billetera Móvil / QR</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-2">Entidad Emisora</label>
            <input 
              type="text" 
              value={proveedor} 
              onChange={(e) => setProveedor(e.target.value)}
              placeholder="Ej: Visa, Mastercard, BNB"
              className="w-full bg-[#27495F] border border-[#3a5a6f] p-3 rounded-xl outline-none focus:border-[#E182CB]"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#E182CB] hover:bg-[#8AD5DF] text-white font-black py-3 rounded-xl tracking-wider transition-all"
          >
            {loading ? 'PROCESANDO COBRO SIMULADO...' : 'CONFIRMAR Y ACTIVAR'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;