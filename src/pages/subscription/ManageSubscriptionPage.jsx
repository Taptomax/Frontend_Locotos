import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageSubscriptionPage = () => {
  const [history, setHistory] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (storedUser?.id_usuario) {
      // Corregido con el prefijo /suscriptions de la API de forma estricta
      axios.get(`http://localhost:3001/api/suscriptions/historial/${storedUser.id_usuario}`)
        .then(res => setHistory(res.data))
        .catch(err => console.error("Error al obtener historial:", err));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#27495F] p-8 text-[#FAFBFD] font-sans">
      <h2 className="text-3xl font-black mb-8 italic text-[#8AD5DF] uppercase">Historial de Transacciones</h2>
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
            {history.map((pago) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSubscriptionPage;