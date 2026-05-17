import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
   
    axios.get('http://localhost:3002/api/suscriptions/planes')
      .then(res => setPlans(res.data))
      .catch(err => console.error("Error al cargar planes:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#27495F] p-8 text-[#FAFBFD] font-sans">
      <header className="border-b-2 border-[#3a5a6f] pb-6 mb-12 flex justify-between items-center">
        <h1 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-[#E182CB] to-[#8AD5DF]">
          SELECCIONA TU PLAN LOCOTO
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.id_plan} className="bg-[#1f3a4a] border border-[#3a5a6f] rounded-2xl p-6 flex flex-col justify-between shadow-2xl transform hover:-translate-y-2 transition-all">
            <div>
              <h3 className="text-2xl font-bold text-[#8AD5DF] mb-4 uppercase">{plan.nombre_plan}</h3>
              <div className="text-4xl font-black mb-6">{plan.precio} <span className="text-sm text-[#E182CB]">BOB / mes</span></div>
              <ul className="space-y-3 opacity-90 text-sm border-t border-[#3a5a6f] pt-4">
                <li>Pantallas simultáneas: <strong>{plan.max_pantallas}</strong></li>
                <li>Calidad de Video: <strong>{plan.calidad_video}</strong></li>
              </ul>
            </div>
            <button 
              onClick={() => navigate(`/subscription/checkout/${plan.id_plan}`)}
              className="mt-8 w-full bg-[#E182CB] hover:bg-[#8AD5DF] text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              SELECCIONAR PLAN
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;