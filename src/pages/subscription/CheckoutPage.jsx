import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  
  // Estados para nuevo método
  const [tipoMetodo, setTipoMetodo] = useState('Tarjeta de Crédito');
  const [proveedor, setProveedor] = useState('Visa');
  
  // Métodos guardados recuperados del backend
  const [savedMethods, setSavedMethods] = useState([]);
  const [useSaved, setUseSaved] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!storedUser) return navigate('/login');
    
    // Recuperar si el usuario ya tiene instrumentos financieros registrados
    axios.get(`http://localhost:3002/api/suscriptions/metodos-pago/${storedUser.id_usuario}`)
      .then(res => {
        setSavedMethods(res.data);
        if (res.data.length > 0) {
          setUseSaved(true);
          setSelectedMethodId(res.data[0].id_metodo);
        }
      })
      .catch(err => console.error("Error cargando métodos de pago:", err));
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let idMetodoFinal = selectedMethodId;

      // Si no va a usar un método guardado, registra uno nuevo (Paso 1)
      if (!useSaved) {
        const mpRes = await axios.post('http://localhost:3002/api/suscriptions/metodos-pago', {
          id_usuario: Number(storedUser.id_usuario),
          tipo_metodo: tipoMetodo,
          proveedor: proveedor
        });
        idMetodoFinal = mpRes.data.metodo_pago.id_metodo;
      }

      // Paso 2: Crear la Suscripción ligada al idMetodoFinal
      await axios.post('http://localhost:3002/api/suscriptions/suscribir', {
        id_usuario: Number(storedUser.id_usuario),
        id_plan: Number(planId),
        id_metodo_pago: Number(idMetodoFinal)
      });

      alert("¡Suscripción procesada con éxito!");
      navigate('/perfiles');
    } catch (error) {
      console.error("Error en facturación:", error);
      alert(error.response?.data?.message || "Error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#27495F] flex items-center justify-center p-6 text-[#FAFBFD]">
      <div className="bg-[#1f3a4a] border border-[#3a5a6f] p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-black mb-6 uppercase text-[#8AD5DF] italic">Pasarela Comercial</h2>
        
        <form onSubmit={handlePayment} className="space-y-6">
          
          {/* SELECCIÓN DE MÉTODOS EXISTENTES */}
          {savedMethods.length > 0 && (
            <div className="bg-[#27495F] p-4 rounded-xl border border-[#3a5a6f]">
              <label className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#8AD5DF] mb-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={useSaved} 
                  onChange={(e) => setUseSaved(e.target.checked)} 
                />
                Usar un medio de pago guardado
              </label>
              
              {useSaved && (
                <select
                  value={selectedMethodId}
                  onChange={(e) => setSelectedMethodId(e.target.value)}
                  className="w-full bg-[#1f3a4a] border border-[#3a5a6f] p-2 rounded-lg text-sm outline-none"
                >
                  {savedMethods.map(m => (
                    <option key={m.id_metodo} value={m.id_metodo}>
                      {m.tipo_metodo} ({m.proveedor}) - {m.token_pago.substring(0, 15)}...
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* FORMULARIO PARA NUEVO MÉTODO */}
          {!useSaved && (
            <div className="space-y-6 transition-all">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Tipo de Medio</label>
                <select 
                  value={tipoMetodo} 
                  onChange={(e) => setTipoMetodo(e.target.value)}
                  className="w-full bg-[#27495F] border border-[#3a5a6f] p-3 rounded-xl outline-none"
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
                  className="w-full bg-[#27495F] border border-[#3a5a6f] p-3 rounded-xl outline-none required"
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#E182CB] hover:bg-[#8AD5DF] text-white font-black py-3 rounded-xl tracking-wider transition-all"
          >
            {loading ? 'PROCESANDO TRANSACCIÓN...' : 'CONFIRMAR Y ACTIVAR MEMBRESÍA'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;