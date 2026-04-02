import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, useNavigate } from 'react-router-dom';

/* --- Iconos --- */
const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);
const CrownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-5-6.5 5 2-7-5.5-4h7z" />
  </svg>
);
const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9z" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const ToggleSwitch = ({ enabled, onChange, isDarkMode }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      enabled 
        ? 'bg-blue-600' 
        : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'
      }`}
    />
  </button>
);

export default function SuscripcionPanelView() {
    const { isDarkMode, cardBg, user, planActual } = useOutletContext();
    const navigate = useNavigate();

    // Estados de switches
    const [autoRenew, setAutoRenew] = useState(true);
    const [notifyBefore, setNotifyBefore] = useState(true);

    // Cálculos de fecha
    const fechaFinStr = user?.fechaFinSuscripcion || new Date().toISOString();
    const fechaFin = new Date(fechaFinStr);
    const hoy = new Date();
    const diffTime = fechaFin.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Status Semántico
    const isVencido = user?.estadoPago === 'VENCIDO' || diffDays < 0;
    const isWarning = diffDays >= 0 && diffDays <= 5 && !isVencido;
    const isOk = diffDays > 5 && !isVencido;

    const statusBanner = {
        ok: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
        warning: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
        danger: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' }
    };
    const activeStatusProps = isVencido ? statusBanner.danger : (isWarning ? statusBanner.warning : statusBanner.ok);

    const getPlanIcon = () => {
        if (planActual === 'PREMIUM') return <CrownIcon />;
        if (planActual === 'BASICO') return <ZapIcon />;
        return <CheckCircleIcon />;
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full pb-10">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Suscripción y Pagos</h2>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Gestión centralizada de tu plan y métodos de pago.</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/suscripcion')}
                    className="premium-btn px-6 py-2.5 rounded-xl font-bold text-white text-sm shadow-lg whitespace-nowrap"
                >
                    Ver Planes Disponibles
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* ── COLUMNA 1: MI PLAN ACTUAL (2/3 ancho) ── */}
                <div className={`col-span-1 lg:col-span-2 p-6 rounded-3xl border shadow-sm flex flex-col ${cardBg}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                            {getPlanIcon()}
                        </div>
                        <div>
                            <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Mi Plan de Servicios</h3>
                            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest leading-none mt-1">SaaS Model</p>
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden ${isDarkMode ? 'bg-slate-800/60 border border-slate-700/50' : 'bg-slate-50 border border-slate-200'}`}>
                        {/* Status Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none opacity-50 ${
                            isVencido ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />

                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{planActual}</span>
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${activeStatusProps.bg} ${activeStatusProps.color} ${activeStatusProps.border}`}>
                                    {isVencido ? 'Suspendido' : 'Activo'}
                                </span>
                            </div>
                            
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {isVencido 
                                    ? 'Tu suscripción ha finalizado. Renueva para continuar operando en tu clínica.' 
                                    : `Tienes acceso completo a todas las funciones de tu plan actual.`}
                            </p>
                            
                            <div className="mt-4 flex items-center gap-5">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Próximo Cobro</p>
                                    <p className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {fechaFin.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="w-px h-8 bg-slate-500/20" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Tiempo Restante</p>
                                    <p className={`font-black ${activeStatusProps.color}`}>
                                        {diffDays < 0 ? 'Expirado' : `${diffDays} Días`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 w-full md:w-auto flex flex-col gap-2 relative z-10">
                            <motion.button 
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/suscripcion')}
                                className="w-full px-6 py-3.5 rounded-xl font-bold bg-blue-600 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:bg-blue-500 transition-colors"
                            >
                                {planActual === 'PRUEBA' || isVencido ? 'Pagar Suscripción' : 'Mejorar Plan'}
                            </motion.button>
                            {!isVencido && planActual !== 'PRUEBA' && (
                                <button className={`w-full px-6 py-3 rounded-xl font-bold text-sm transition-colors border ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>
                                    Cancelar Plan
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── COLUMNA 2: METODO DE PAGO Y FACTURACION (1/3 ancho) ── */}
                <div className="col-span-1 space-y-6">
                    {/* Tarjeta Visual de Pago */}
                    <div className={`p-6 rounded-3xl border shadow-sm ${cardBg}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCardIcon />
                            <h3 className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Método de Pago</h3>
                        </div>

                        {/* Glassmorphism Credit Card Mockup */}
                        <div className="relative w-full aspect-[1.586] rounded-2xl p-5 flex flex-col justify-between overflow-hidden group shadow-lg"
                             style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.9) 0%, rgba(37,99,235,0.9) 100%)' }}>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {/* Reflexión superior */}
                            <div className="absolute -top-24 -left-20 w-64 h-64 bg-white/20 rounded-full blur-[40px] pointer-events-none" />

                            <div className="flex justify-between items-start relative z-10">
                                <div className="text-white">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Mercado Pago</p>
                                    <div className="mt-1 flex items-center gap-1.5 opacity-90">
                                        <div className="w-6 h-4 bg-yellow-400 rounded-sm border border-black/10 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        </div>
                                        <span className="text-xs font-semibold">Tokenizado</span>
                                    </div>
                                </div>
                                <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="10" r="10" fill="#EB001B" fillOpacity="0.8"/>
                                    <circle cx="22" cy="10" r="10" fill="#F79E1B" fillOpacity="0.8"/>
                                </svg>
                            </div>

                            <div className="relative z-10 flex flex-col">
                                <div className="text-white/80 font-mono tracking-[0.2em] mb-2 text-lg">
                                    **** **** **** 1234
                                </div>
                                <div className="flex justify-between text-white align-bottom">
                                    <div className="uppercase font-bold tracking-wider text-xs">
                                        DR {user?.nombre?.substring(0, 10)} {user?.apellido?.substring(0, 5)}
                                    </div>
                                    <div className="font-mono text-xs opacity-90">12/28</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${isDarkMode ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
                                Actualizar
                            </button>
                            <button className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${isDarkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                                Eliminar
                            </button>
                        </div>
                    </div>

                    {/* Preferencias de Facturación */}
                    <div className={`p-6 rounded-3xl border shadow-sm ${cardBg}`}>
                        <h3 className={`font-black mb-5 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Ajustes de Facturación</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Renovación Automática</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Cobro automático al vencer</p>
                                </div>
                                <ToggleSwitch enabled={autoRenew} onChange={setAutoRenew} isDarkMode={isDarkMode} />
                            </div>
                            
                            <div className={`w-full h-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Notificar Vencimiento</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Aviso por email 3 días antes</p>
                                </div>
                                <ToggleSwitch enabled={notifyBefore} onChange={setNotifyBefore} isDarkMode={isDarkMode} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
        </motion.div>
    );
}
