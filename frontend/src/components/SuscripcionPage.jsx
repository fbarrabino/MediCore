import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import api from '../api/axiosConfig';

const HeartPulseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const Blob = ({ className, style, animClass }) => (
  <div className={`absolute rounded-full pointer-events-none ${animClass} ${className}`} style={style} />
);

export default function SuscripcionPage({ onLogout }) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (plan) => {
    try {
      setLoading(plan);
      const res = await api.post('/pagos/crear-preferencia', { plan });
      if (res.data && res.data.url_pago) {
        window.location.href = res.data.url_pago;
      }
    } catch (error) {
      console.error('Error al crear preferencia', error);
      alert('Hubo un error al procesar tu pago. Intenta nuevamente.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={`min-h-screen relative flex items-center justify-center overflow-hidden p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Background Ambience */}
      <Blob animClass="anim-float" className="w-[600px] h-[600px] -top-32 -left-32" style={{ background: isDarkMode ? 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <Blob animClass="anim-float2" className="w-[500px] h-[500px] -bottom-20 -right-20" style={{ background: isDarkMode ? 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #4f46e5, #ec4899)' }}>
            <div className="text-white">
              <HeartPulseIcon />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Tu acceso ha finalizado
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Tu cuenta y los datos de tus pacientes se encuentran congelados y resguardados de forma totalmente segura.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-sm font-bold">
            <LockIcon /> Todos tus datos están protegidos y esperando por ti.
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Básico */}
          <motion.div
            whileHover={{ y: -5 }}
            className={`border p-8 rounded-3xl flex flex-col transition-all ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}
          >
            <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest mb-4 ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
              Plan Básico
            </span>
            <h3 className={`text-4xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              $15.000 <span className={`text-base font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ARS/mes</span>
            </h3>
            <p className={`mb-6 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Para profesionales independientes.
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Hasta 200 pacientes activos
              </li>
              <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Historial clínico digital e impresión
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('BASICO')}
              disabled={loading === 'BASICO'}
              className={`block text-center w-full py-4 rounded-xl font-black transition-all border-2 ${isDarkMode ? 'bg-transparent text-white border-slate-600 hover:bg-slate-700' : 'bg-transparent text-slate-800 border-slate-300 hover:bg-slate-50'} ${loading === 'BASICO' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading === 'BASICO' ? 'Procesando...' : 'Pagar $15.000 ARS'}
            </button>
          </motion.div>

          {/* Plan Premium */}
          <motion.div
            whileHover={{ y: -5 }}
            className={`border p-8 rounded-3xl flex flex-col relative transform md:-translate-y-4 shadow-2xl ${isDarkMode ? 'bg-slate-800 border-indigo-500/50 shadow-indigo-500/10' : 'bg-indigo-50/50 border-indigo-300 shadow-indigo-500/10'}`}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              Profesional Libre
            </div>
            <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest mb-4 mt-2 ${isDarkMode ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-fuchsia-100 text-fuchsia-700'}`}>
              Plan Premium
            </span>
            <h3 className={`text-4xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              $25.000 <span className={`text-base font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ARS/mes</span>
            </h3>
            <p className={`mb-6 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Desbloquea todo el potencial de tu consultorio.
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Pacientes ilimitados
              </li>
              <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Soporte técnico de prioridad 24/7
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('PREMIUM')}
              disabled={loading === 'PREMIUM'}
              className={`block text-center w-full py-4 rounded-xl font-black transition-all bg-gradient-to-r from-indigo-600 to-pink-600 text-white hover:opacity-90 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.5)] ${loading === 'PREMIUM' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading === 'PREMIUM' ? 'Procesando...' : 'Pagar $25.000 ARS'}
            </button>
          </motion.div>
        </div>

        <div className="mt-12 text-center flex flex-col items-center justify-center gap-4">
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            ¿Ya hiciste un pago y no se reflejan los cambios? <a href="mailto:medicore.soporte@gmail.com" className="text-indigo-500 font-bold hover:underline">Contáctanos.</a>
          </p>
          <button
            onClick={onLogout}
            className={`text-sm font-bold mt-2 uppercase tracking-wide transition-colors ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}
          >
            Cerrar Sesión
          </button>
        </div>
      </motion.div>
    </div>
  );
}
