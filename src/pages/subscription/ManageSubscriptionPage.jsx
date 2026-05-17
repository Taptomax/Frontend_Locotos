import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ManageSubscriptionPage = () => {
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate(); 

  const fetchSubscriptionData = () => {
    if (storedUser?.id_usuario) {
     
      axios.get(`http://localhost:3002/api/suscriptions/historial/${storedUser.id_usuario}`)
        .then(res => setHistory(res.data))
        .catch(err => console.error("Error al obtener historial:", err));

      
      axios.get(`http://localhost:3002/api/suscriptions/status/${storedUser.id_usuario}`)
        .then(res => setStatus(res.data))
        .catch(err => console.error("Error al obtener status:", err));
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

 
  const handleToggleRenovacion = async () => {
    try {
      await axios.post('http://localhost:3002/api/suscriptions/alternar-renovacion', { id_usuario: storedUser.id_usuario });
      alert("Preferencia de renovación actualizada.");
      fetchSubscriptionData(); // Recargar vista
    } catch (error) {
      alert("Error al alternar renovación.");
    }
  };

  
  const handleCancelarSuscripcion = async () => {
    if (window.confirm("¿Estás seguro de que deseas cancelar tu suscripción inmediatamente? Perderás acceso.")) {
      try {
        await axios.post('http://localhost:3002/api/suscriptions/cancelar', { id_usuario: storedUser.id_usuario });
        alert("Suscripción cancelada exitosamente.");
        fetchSubscriptionData();
      } catch (error) {
        alert("Error al cancelar la suscripción.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#27495F] p-8 text-[#FAFBFD] font-sans">
      
      {/* BOTÓN INDEPENDIENTE PARA VOLVER AL CATÁLOGO */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 text-sm font-bold text-[#8AD5DF] hover:text-[#E182CB] transition-colors bg-transparent border-none cursor-pointer outline-none"
      >
        ← Volver al Catálogo
      </button>

      <h2 className="text-3xl font-black mb-4 italic text-[#8AD5DF] uppercase">Panel de Suscripción Distribuido</h2>
      
      {/* CUADRO DE ESTADO ACTUAL */}
      {status && (
        <div className="bg-[#1f3a4a] border border-[#3a5a6f] p-6 rounded-2xl max-w-4xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#E182CB] font-bold">Estado del Servicio</p>
            <h3 className="text-xl font-bold mt-1">
              Acceso Multimedia: {status.tiene_acceso ? <span className="text-emerald-400">AUTORIZADO ✅</span> : <span className="text-rose-400">REVOCADO ❌</span>}
            </h3>
            {status.suscripcion && (
              <p className="text-xs opacity-75 mt-2">
                Plan Actual: <strong>{status.suscripcion.detalles_plan?.nombre_plan || `ID: ${status.suscripcion.id_plan}`}</strong> | Vence el: {new Date(status.suscripcion.fecha_fin).toLocaleDateString()}
              </p>
            )}
          </div>
          {status.tiene_acceso && (
            <div className="flex gap-4">
              <button 
                onClick={handleToggleRenovacion}
                className="bg-[#8AD5DF] hover:opacity-90 text-[#1f3a4a] font-bold py-2 px-4 rounded-xl text-xs transition-all"
              >
                🔄 {status.suscripcion?.renovacion_automatica ? "Desactivar Auto-Renovación" : "Activar Auto-Renovación"}
              </button>
              <button 
                onClick={handleCancelarSuscripcion}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all"
              >
                🛑 Cancelar Membresía
              </button>
            </div>
          )}
        </div>
      )}

      {/* TABLA DE HISTORIAL DE FACTURACIÓN */}
      <h3 className="text-xl font-bold max-w-4xl mx-auto mb-4 text-[#8AD5DF]">Historial de Transacciones</h3>
      <div className="max-w-4xl mx-auto bg-[#1f3a4a] border border-[#3a5a6f] rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#27495F] border-b border-[#3a5a6f] text-xs uppercase tracking-wider text-[#E182CB]">
              <th className="p-4">ID Pago</th>
              <th className="p-4">Monto</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Ref. Auditoría (Simulado)</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3a5a6f] text-sm">
            {history.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center opacity-50">No existen registros de cobros en MySQL.</td></tr>
            ) : (
              history.map((pago) => (
                <tr key={pago.id_pago} className="hover:bg-[#27495F]/30 transition-colors">
                  <td className="p-4 font-mono">#{pago.id_pago}</td>
                  <td className="p-4 font-bold">{pago.monto} {pago.moneda}</td>
                  <td className="p-4">{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                  <td className="p-4 text-[#8AD5DF] font-mono">{pago.codigo_transaccion_externo}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-[10px] font-black rounded bg-emerald-500/20 text-emerald-400 uppercase">
                      {pago.estado_transaccion}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSubscriptionPage;