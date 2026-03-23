import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import LoginPage from './LoginPage';
import RegistroPage from './RegistroPage';
import ForgotPasswordModal from './ForgotPasswordModal';

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);
const HeartPulseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
  </svg>
);

/* SVG Icons for Features */
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
const FileTextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const DevicesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect width="16" height="12" x="4" y="4" rx="2" ry="2"/><rect width="6" height="10" x="9" y="10" rx="2" ry="2"/><line x1="8" x2="16" y1="20" y2="20"/>
  </svg>
);
const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
  </svg>
);
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const PrintIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

/* Animated background blob */
const Blob = ({ className, style, animClass }) => (
  <div
    className={`absolute rounded-full pointer-events-none ${animClass} ${className}`}
    style={style}
  />
);

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function LandingPage({ onLogin }) {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'register' | 'forgot-password' | null

  const handleLoginSuccess = (user) => {
    sessionStorage.setItem('medicore_user', JSON.stringify(user));
    onLogin(user);
    navigate('/panel');
  };

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-300 selection:bg-blue-500/30 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'} ${activeModal ? 'h-screen overflow-hidden' : ''}`}>
      
      {/* ── Navbar ── */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-950/80 border-slate-800/60' : 'bg-white/80 border-slate-200/80'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <HeartPulseIcon />
            </div>
            <span className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>MediCore</span>
          </div>

          {/* Links (Desktop) */}
          <div className={`hidden md:flex items-center gap-8 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <a href="#caracteristicas" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-blue-600'}`}>Características</a>
            <a href="#planes" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-blue-600'}`}>Planes</a>
            <a href="#contacto" className={`transition-colors ${isDarkMode ? 'hover:text-white' : 'hover:text-blue-600'}`}>Contacto</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
              title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setActiveModal('register')}
              className={`hidden sm:block px-5 py-2.5 rounded-xl text-sm font-black border-2 transition-all ${isDarkMode ? 'bg-transparent text-white border-white/20 hover:border-white/40' : 'bg-transparent text-blue-600 border-blue-200 hover:border-blue-400'}`}
            >
              Registrar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setActiveModal('login')}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:bg-blue-500 transition-all"
            >
              Iniciar Sesión
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center justify-center">
        {/* Animated Aesthetic Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-2]">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[80px] ${isDarkMode ? 'bg-indigo-600/20' : 'bg-blue-400/20'}`}
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className={`absolute top-40 -right-20 w-[500px] h-[500px] rounded-full blur-[80px] ${isDarkMode ? 'bg-emerald-600/10' : 'bg-cyan-400/20'}`}
          />
          <motion.div 
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className={`absolute -bottom-40 left-1/4 w-[400px] h-[400px] rounded-full blur-[60px] ${isDarkMode ? 'bg-blue-600/20' : 'bg-indigo-400/10'}`}
          />
        </div>

        {/* Animated ECG Heartbeat Background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full overflow-hidden pointer-events-none z-[0] opacity-40">
          <svg viewBox="0 0 1000 200" className={`w-full h-[350px] md:h-[450px] ${isDarkMode ? 'text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]' : 'text-blue-600 drop-shadow-[0_0_12px_rgba(37,99,235,0.6)]'}`} preserveAspectRatio="xMidYMid slice">
            <motion.path
              d="M0,100 L250,100 L280,80 L310,150 L350,10 L390,170 L420,100 L450,100 L550,100 L580,80 L610,150 L650,10 L690,170 L720,100 L750,100 L1000,100"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ filter: 'blur(3px)' }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1.2], opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={`inline-block py-1.5 px-4 rounded-full border text-xs font-bold tracking-widest uppercase mb-6 shadow-sm ${isDarkMode ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-blue-100/60 border-blue-200 text-blue-700'}`}>
              Software Médico para Doctores
            </span>
            <h1 className={`text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Todo para la administración de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">clínica o salita</span>
            </h1>
            <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Agiliza turnos, centraliza historias clínicas y mejora la atención a tus pacientes con la plataforma en la nube más intuitiva y segura.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveModal('register')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_8px_30px_-4px_rgba(79,70,229,0.5)]"
              >
                Comenzar Prueba Gratuita
              </motion.button>
              <button className={`w-full sm:w-auto px-8 py-4 rounded-2xl border font-bold transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                Agendar una Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="caracteristicas" className={`py-24 px-6 border-y transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className={`inline-block py-1 px-4 rounded-full border text-xs font-bold tracking-widest uppercase mb-4 ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-indigo-100/60 border-indigo-200 text-indigo-700'}`}>Todo incluido en Premium</span>
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Herramientas diseñadas para médicos</h2>
            <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Simplificamos la carga administrativa para que te enfoques en lo que realmente importa: la salud de tus pacientes.</p>
          </motion.div>

          {/* Row 1 – 4 main features */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
          >
            {[
              { icon: <UsersIcon />, color: 'indigo', label: 'Gestión de Pacientes', desc: 'Centraliza historias clínicas con estrictos estándares de seguridad. Registra evoluciones con plantillas inteligentes en segundos.', badge: null },
              { icon: <CalendarIcon />, color: 'blue', label: 'Agenda Inteligente', desc: 'Programa consultas, controla la sala de espera y gestiona estados de turnos en un panel visual integrado con vista diaria y semanal.', badge: 'Premium' },
              { icon: <ClipboardIcon />, color: 'emerald', label: 'Historias Clínicas', desc: 'Formularios estructurados con 6 campos clínicos: diagnóstico, tratamiento, medicación, examen físico, antecedentes y más.', badge: null },
              { icon: <ImageIcon />, color: 'rose', label: 'Estudios Multimedia', desc: 'Adjuntá imágenes de estudios médicos (hasta 5 MB) por paciente. Visualizalos inline y descargalos cuando los necesites.', badge: null },
            ].map(({ icon, color, label, desc, badge }, i) => {
              const colors = {
                indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', ring: 'ring-indigo-400/30' },
                blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', ring: 'ring-blue-400/30' },
                emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', ring: 'ring-emerald-400/30' },
                rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', ring: 'ring-rose-400/30' },
              };
              const c = colors[color];
              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 40, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22,1,0.36,1], delay: i * 0.1 } }
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`feature-card-shimmer border p-8 rounded-3xl transition-all group cursor-default ${
                    isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${c.bg} ${c.text} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:ring-4 ${c.ring} transition-all duration-300`}>
                    {icon}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{label}</h3>
                    {badge && <span className="text-[9px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">{badge}</span>}
                  </div>
                  <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Row 2 – 4 secondary features */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: <BellIcon />, color: 'amber', label: 'Recordatorios Automáticos', desc: 'Notificaciones automáticas para tus pacientes antes de sus turnos. Reducí el ausentismo y mejorá la adherencia al tratamiento.', badge: 'Premium', soon: true },
              { icon: <ChartIcon />, color: 'cyan', label: 'Reportes y Estadísticas', desc: 'Visualizá datos demográficos y métricas de atención. Gráficos mensuales de pacientes atendidos, turnos y distribución por edad.', badge: null },
              { icon: <SettingsIcon />, color: 'violet', label: 'Gestión del Consultorio', desc: 'Configurá tu entorno de trabajo, administrá suscripciones y mantené control administrativo total desde un único panel seguro.', badge: null },
              { icon: <PrintIcon />, color: 'teal', label: 'Exportar PDF / Impresión', desc: 'Generá e imprimí la historia clínica completa de cualquier paciente en PDF con un solo click, lista para presentar.', badge: null },
            ].map(({ icon, color, label, desc, badge, soon }, i) => {
              const colors = {
                amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', ring: 'ring-amber-400/30' },
                cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', ring: 'ring-cyan-400/30' },
                violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', ring: 'ring-violet-400/30' },
                teal: { bg: 'bg-teal-500/10', text: 'text-teal-500', ring: 'ring-teal-400/30' },
              };
              const c = colors[color];
              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 40, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22,1,0.36,1], delay: i * 0.1 } }
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`feature-card-shimmer border p-7 rounded-3xl transition-all group cursor-default ${
                    isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.text} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:ring-4 ${c.ring} transition-all duration-300`}>
                    {icon}
                  </div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{label}</h3>
                    {badge && <span className="text-[9px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">{badge}</span>}
                    {/* {soon && <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>Próximamente</span>} */}
                  </div>
                  <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Animated Demo Section ── */}
      <DemoSection isDarkMode={isDarkMode} onCta={() => setActiveModal('register')} />

      {/* ── Pricing Section ── */}
      <section id="planes" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Planes simples y transparentes</h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Sin costos ocultos ni complicaciones técnicas.</p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Plan Prueba */}
            <motion.div variants={fadeUp} className={`border p-8 rounded-3xl flex flex-col transition-colors relative group ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
              <div className="flex-1">
                <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest mb-4 ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  Plan Prueba (Beta)
                </span>
                <h3 className={`text-4xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  $0 <span className={`text-lg font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ARS/mes</span>
                </h3>
                <p className={`mb-6 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Ideal para probar la plataforma de forma gratuita.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Acceso completo gratuito por 30 días
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Límite de 200 pacientes por mes
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Sincronización con Google Calendar
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setActiveModal('register')}
                className={`w-full py-4 rounded-xl font-black transition-all border-2 ${isDarkMode ? 'bg-transparent text-white border-slate-600 hover:bg-slate-700' : 'bg-transparent text-slate-800 border-slate-300 hover:bg-slate-50'}`}
              >
                Comenzar Gratis
              </button>
            </motion.div>

            {/* Plan Básico */}
            <motion.div variants={fadeUp} className={`border p-8 rounded-3xl flex flex-col transition-colors relative group ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
              <div className="flex-1">
                <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest mb-4 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                  Plan Básico
                </span>
                <h3 className={`text-4xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  $15.000 <span className={`text-base font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ARS/mes</span>
                </h3>
                <p className={`mb-6 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Para profesionales independientes o consultorios pequeños.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Acceso completo gratuito por 30 días
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Límite de 200 pacientes por mes
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Gestión de turnos
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Historias clínicas
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Sincronización con Google Calendar
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setActiveModal('register')}
                className={`w-full py-4 rounded-xl font-black transition-all border-2 ${isDarkMode ? 'bg-transparent text-white border-slate-600 hover:bg-slate-700' : 'bg-transparent text-slate-800 border-slate-300 hover:bg-slate-50'}`}
              >
                Suscribirse
              </button>
            </motion.div>

            {/* Plan Premium */}
            <motion.div variants={fadeUp} className={`border p-8 rounded-3xl flex flex-col relative group transform md:-translate-y-4 shadow-2xl ${isDarkMode ? 'bg-slate-800/80 border-blue-500/50 shadow-blue-500/10' : 'bg-blue-50/50 border-blue-300 shadow-blue-500/10'}`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                Recomendado
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-3xl pointer-events-none" />
              <div className="flex-1 relative z-10">
                <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest mb-4 mt-2 ${isDarkMode ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-fuchsia-100 text-fuchsia-700'}`}>
                  Plan Premium
                </span>
                <h3 className={`text-4xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  $25.000 <span className={`text-base font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ARS/mes</span>
                </h3>
                <p className={`mb-6 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  La solución completa para clínicas que requieren escalar sin límites.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Acceso completo gratuito por 30 días
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> <strong>Pacientes ilimitados</strong>
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Gestión de turnos
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Historias clínicas
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Sincronización con Google Calendar
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Recordatorios automáticos
                  </li>
                  <li className={`flex items-start gap-3 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span> Soporte para agregado de secciones
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setActiveModal('register')}
                className="relative z-10 block text-center w-full py-4 rounded-xl font-black transition-all bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.5)]"
              >
                Suscribirse a Premium
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Fat Footer ── */}
      <footer id="contacto" className={`border-t pt-20 pb-10 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <HeartPulseIcon />
              </div>
              <span className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>MediCore</span>
            </div>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Gestión clínica de vanguardia. Potenciamos el trabajo médico a través de soluciones intuitivas, seguras y escalables en la nube.
            </p>
          </div>

          {/* Quick Links Col */}
          <div className="md:col-span-1">
            <h4 className={`text-sm font-black uppercase tracking-widest mb-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="#" className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}>Inicio</a></li>
              <li><a href="#caracteristicas" className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}>Características</a></li>
              <li><a href="#planes" className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}>Planes y Precios</a></li>
              <li>
                <button 
                  onClick={() => setActiveModal('register')}
                  className={`text-sm font-medium transition-colors bg-transparent border-none p-0 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  Crear Cuenta
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-1">
            <h4 className={`text-sm font-black uppercase tracking-widest mb-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Contacto</h4>
            <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-800'}>Soporte Técnico y Consultas:</strong><br/>
              +54 9 11 5555-5555
            </p>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              ¿Necesitas una función a medida para tu clínica?<br/>
              <a href="mailto:medicore.soporte@gmail.com" className="text-blue-500 hover:underline">medicore.soporte@gmail.com</a>
            </p>
          </div>

          {/* Legal Col */}
          <div className="md:col-span-1">
            <h4 className={`text-sm font-black uppercase tracking-widest mb-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Legal</h4>
            <ul className="space-y-3 mb-6">
              <li><a href="#" className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}>Términos de Servicio</a></li>
              <li><a href="#" className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}>Política de Privacidad</a></li>
            </ul>
          </div>
        </div>

        <div className={`max-w-6xl mx-auto pt-8 border-t text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 ${isDarkMode ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
          <div className="text-xs font-medium">
            © {new Date().getFullYear()} MediCore Software. Todos los derechos reservados.
          </div>
          <div className="text-xs font-medium">
            Hecho con ❤️ para profesionales de la salud.
          </div>
        </div>
      </footer>

      {/* ── Auth Modals ── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[500px] cursor-default flex justify-center"
            >
              {activeModal === 'login' && (
                <div className="w-[400px]">
                  <LoginPage 
                    isModal 
                    onClose={() => setActiveModal(null)} 
                    onLogin={handleLoginSuccess}
                    onSwitchToRegister={() => setActiveModal('register')}
                    onForgotPassword={() => setActiveModal('forgot-password')}
                  />
                </div>
              )}
              {activeModal === 'register' && (
                <div className="w-[480px]">
                  <RegistroPage 
                    isModal 
                    onClose={() => setActiveModal(null)} 
                    onSwitchToLogin={() => setActiveModal('login')}
                  />
                </div>
              )}
              {activeModal === 'forgot-password' && (
                <ForgotPasswordModal 
                  isOpen={true} 
                  onClose={() => setActiveModal(null)} 
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ============================================================
   DEMO SECTION – 8-scene animated walkthrough of all platform sections
   ============================================================ */

const DEMO_SCENES = [
  { id: 'panel',    label: 'Panel Principal',         url: '/panel',                    emoji: '🏠', color: '#3b82f6' },
  { id: 'crear',    label: 'Crear Paciente',           url: '/panel/pacientes',          emoji: '👤', color: '#10b981' },
  { id: 'detalle',  label: 'Detalle del Paciente',     url: '/panel/paciente/42',        emoji: '📋', color: '#6366f1' },
  { id: 'evolucion',label: 'Agregar Evolución',        url: '/panel/paciente/42',        emoji: '📝', color: '#8b5cf6' },
  { id: 'agenda',   label: 'Agenda + Google Calendar', url: '/panel/agenda',             emoji: '📅', color: '#f59e0b' },
  { id: 'turno',    label: 'Agendar Turno',            url: '/panel/agenda',             emoji: '⏰', color: '#ef4444' },
  { id: 'reportes', label: 'Reportes y Estadísticas',  url: '/panel/reportes',           emoji: '📊', color: '#06b6d4' },
  { id: 'gestion',  label: 'Gestión del Consultorio',  url: '/panel/gestion',            emoji: '⚙️', color: '#a855f7' },
];

const SCENE_DURATION = 5000; // ms per scene

/* --- Individual screen renderers --- */

function ScreenPanel({ isDarkMode }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '12px 14px', gap: 8 }}>
      {/* Search bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        <div style={{ flex: 1, background: isDarkMode ? 'rgba(30,41,59,0.6)' : 'rgba(241,245,249,0.9)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 10, padding: '7px 12px', color: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          🔍 Buscar por DNI o Nombre...
        </div>
        <div style={{ padding: '7px 14px', background: 'linear-gradient(135deg,#2563eb,#6366f1)', borderRadius: 10, color: 'white', fontWeight: 800, fontSize: 11 }}>Buscar</div>
        <div style={{ padding: '7px 12px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 10, color: '#93c5fd', fontWeight: 800, fontSize: 11 }}>+ Nuevo</div>
      </div>
      {/* Panel card */}
      <div style={{ flex: 1, background: isDarkMode ? 'rgba(15,23,42,0.7)' : 'rgba(248,250,252,0.9)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ color: isDarkMode ? 'white' : '#1e293b', fontWeight: 900, fontSize: 13 }}>Panel de Hoy – Sala de Espera</div>
            <div style={{ color: '#64748b', fontSize: 10 }}>Jueves 26 de marzo · 3 pacientes en espera</div>
          </div>
          <div style={{ padding: '5px 12px', background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: 20, color: 'white', fontWeight: 800, fontSize: 10 }}>✚ Agregar</div>
        </div>
        {[
          { name: 'Carlos Mendez', estado: 'En espera', hora: '09:00', col: '#f59e0b' },
          { name: 'María González', estado: 'En atención', hora: '09:30', col: '#10b981' },
          { name: 'Roberto Sánchez', estado: 'Completado', hora: '10:00', col: '#6366f1' },
        ].map(({ name, estado, hora, col }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', marginBottom: 5, background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 11 }}>{name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: isDarkMode ? 'white' : '#1e293b', fontWeight: 700, fontSize: 11 }}>{name}</div>
              <div style={{ color: '#64748b', fontSize: 9 }}>Turno {hora}</div>
            </div>
            <div style={{ padding: '3px 8px', borderRadius: 12, background: `${col}22`, border: `1px solid ${col}44`, color: col, fontSize: 9, fontWeight: 800 }}>{estado}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenCrearPaciente({ isDarkMode, frame }) {
  const fields = [
    { l: 'Nombre completo', v: 'Ana Paula Gómez', d: 0 },
    { l: 'DNI', v: '32.456.789', d: 20 },
    { l: 'Fecha de Nac.', v: '14/03/1990', d: 35 },
    { l: 'Teléfono', v: '+54 9 364 4882163', d: 50 },
    { l: 'Email', v: 'anapaula@gmail.com', d: 65 },
    { l: 'Dirección', v: 'Av. Libertad 1245', d: 80 },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 16 }}>
      <div style={{ width: '100%', background: isDarkMode ? 'rgba(12,20,44,0.95)' : 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '18px 20px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
        <div style={{ color: isDarkMode ? 'white' : '#1e293b', fontWeight: 900, fontSize: 14, marginBottom: 2 }}>Nuevo Paciente</div>
        <div style={{ color: '#64748b', fontSize: 10, marginBottom: 14 }}>Completá los datos del paciente</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {fields.map(({ l, v, d }) => {
            const chars = Math.min(v.length, Math.max(0, frame - d) * 2);
            return (
              <div key={l}>
                <div style={{ color: '#64748b', fontSize: 9, fontWeight: 700, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{l}</div>
                <div style={{ background: isDarkMode ? 'rgba(99,102,241,0.08)' : 'rgba(248,250,252,0.9)', border: `1px solid ${chars < v.length && chars > 0 ? 'rgba(99,102,241,0.5)' : 'rgba(148,163,184,0.2)'}`, borderRadius: 8, padding: '5px 8px', color: isDarkMode ? '#e2e8f0' : '#1e293b', fontSize: 10, fontWeight: 600, minHeight: 24 }}>
                  {v.slice(0, chars)}{chars < v.length && chars > 0 && <span style={{ opacity: 0.6, color: '#6366f1' }}>|</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, padding: '9px', background: 'linear-gradient(135deg,#2563eb,#6366f1)', borderRadius: 10, color: 'white', fontWeight: 900, fontSize: 12, textAlign: 'center' }}>Guardar Paciente ✓</div>
      </div>
    </div>
  );
}

function ScreenDetallePaciente({ isDarkMode }) {
  return (
    <div style={{ padding: '10px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: isDarkMode ? 'rgba(15,23,42,0.7)' : 'rgba(248,250,252,0.9)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 15 }}>A</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: isDarkMode ? 'white' : '#1e293b', fontWeight: 900, fontSize: 13 }}>Ana Paula Gómez</div>
          <div style={{ color: '#64748b', fontSize: 10 }}>DNI: 32.456.789 · 34 años · anapaula@gmail.com</div>
        </div>
        <div style={{ padding: '5px 10px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#a5b4fc', fontSize: 10, fontWeight: 800 }}>✏ Editar</div>
        <div style={{ padding: '5px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', fontSize: 10, fontWeight: 800 }}>🖨 PDF</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
        <div style={{ background: isDarkMode ? 'rgba(15,23,42,0.7)' : 'rgba(248,250,252,0.9)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px' }}>
          <div style={{ color: '#64748b', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Datos Clínicos</div>
          {['Nombre: Ana Paula Gómez', 'DNI: 32.456.789', 'Nacimiento: 14/03/1990', 'Tel: +54 9 364 4882163', 'Email: anapaula@gmail.com'].map(d => (
            <div key={d} style={{ color: isDarkMode ? '#94a3b8' : '#475569', fontSize: 10, marginBottom: 4, padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{d}</div>
          ))}
        </div>
        <div style={{ background: isDarkMode ? 'rgba(15,23,42,0.7)' : 'rgba(248,250,252,0.9)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px' }}>
          <div style={{ color: '#64748b', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Estudios Multimedia</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {['ECG 12/03', 'RX Tórax', 'Lab. Marzo', 'Echo. Abd.'].map((s, i) => (
              <div key={i} style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 16 }}>🩻</div>
                <div style={{ color: '#a5b4fc', fontSize: 9, fontWeight: 700, marginTop: 2 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenEvolucion({ isDarkMode, frame }) {
  const FIELDS = [
    { l: 'Motivo', v: 'Control mensual de presión arterial', d: 0 },
    { l: 'Diagnóstico', v: 'Hipertensión arterial esencial (I10)', d: 20 },
    { l: 'Tratamiento', v: 'Ajuste de dosis de Enalapril', d: 40 },
    { l: 'Medicación', v: 'Enalapril 10mg/d · Aspirina 100mg/d', d: 55 },
    { l: 'Examen Físico', v: 'PA: 140/90 · FC: 78bpm · Peso: 72kg', d: 70 },
    { l: 'Antecedentes', v: 'HTA desde 2018. Sin alergias.', d: 85 },
  ];
  const zoomScale = frame > 80 ? 1.12 : 1;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 12 }}>
      <div style={{
        width: '100%',
        background: isDarkMode ? 'rgba(12,20,44,0.97)' : 'white',
        border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: 18,
        padding: '14px 16px',
        boxShadow: `0 0 0 ${frame > 80 ? 8 : 0}px rgba(99,102,241,0.08)`,
        transform: `scale(${zoomScale})`,
        transition: 'transform 1.4s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{ color: '#94a3b8', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Nueva Evolución Clínica</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {FIELDS.map(({ l, v, d }) => {
            const chars = Math.min(v.length, Math.max(0, frame - d) * 2);
            return (
              <div key={l}>
                <div style={{ color: '#64748b', fontSize: 8, fontWeight: 700, marginBottom: 2 }}>{l}</div>
                <div style={{ background: isDarkMode ? 'rgba(99,102,241,0.06)' : 'rgba(248,250,252,0.9)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 6, padding: '4px 7px', color: isDarkMode ? '#e2e8f0' : '#1e293b', fontSize: 9, fontWeight: 600, minHeight: 20 }}>
                  {v.slice(0, chars)}{chars > 0 && chars < v.length && <span style={{ color: '#6366f1', opacity: 0.7 }}>|</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, padding: '7px', background: 'linear-gradient(135deg,#2563eb,#6366f1)', borderRadius: 8, color: 'white', fontWeight: 900, fontSize: 11, textAlign: 'center' }}>Guardar Evolución</div>
        {frame > 95 && <div style={{ marginTop: 6, padding: '6px 10px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10b981', fontSize: 10, fontWeight: 800, opacity: Math.min(1, (frame - 95) / 10) }}>✓ Evolución guardada correctamente</div>}
      </div>
    </div>
  );
}

function ScreenAgenda({ isDarkMode }) {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
  const hours = ['08:00', '09:00', '10:00', '11:00'];
  const events = [{ d: 0, h: 1, n: 'Carlos M.', c: '#3b82f6' }, { d: 1, h: 0, n: 'Ana G.', c: '#10b981' }, { d: 2, h: 2, n: 'Roberto S.', c: '#f59e0b' }, { d: 3, h: 1, n: 'Laura P.', c: '#6366f1' }];
  return (
    <div style={{ padding: '10px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: isDarkMode ? 'white' : '#1e293b', fontWeight: 900, fontSize: 13 }}>Agenda Semanal</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'rgba(234,67,53,0.12)', border: '1px solid rgba(234,67,53,0.3)', borderRadius: 20 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: 'linear-gradient(135deg,#ea4335,#fbbc04,#34a853,#4285f4)' }} />
          <span style={{ color: '#fca5a5', fontSize: 9, fontWeight: 800 }}>Sincronizado con Google Calendar</span>
        </div>
      </div>
      <div style={{ flex: 1, background: isDarkMode ? 'rgba(15,23,42,0.7)' : 'rgba(248,250,252,0.9)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '44px repeat(5,1fr)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div />
          {days.map((d, i) => <div key={i} style={{ padding: '6px 4px', textAlign: 'center', color: i === 3 ? '#60a5fa' : '#64748b', fontSize: 10, fontWeight: i === 3 ? 900 : 700, borderLeft: '1px solid rgba(255,255,255,0.04)' }}>{d}</div>)}
        </div>
        {hours.map((hr, hi) => (
          <div key={hi} style={{ display: 'grid', gridTemplateColumns: '44px repeat(5,1fr)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ padding: '8px 4px', color: '#475569', fontSize: 9, fontWeight: 600 }}>{hr}</div>
            {days.map((_, di) => {
              const ev = events.find(e => e.d === di && e.h === hi);
              return (
                <div key={di} style={{ borderLeft: '1px solid rgba(255,255,255,0.04)', padding: 3, minHeight: 30 }}>
                  {ev && <div style={{ background: `${ev.c}20`, border: `1px solid ${ev.c}40`, borderLeft: `2px solid ${ev.c}`, borderRadius: 5, padding: '2px 5px', color: ev.c, fontSize: 8, fontWeight: 800 }}>{ev.n}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenTurno({ isDarkMode, frame }) {
  const fields = [
    { l: 'Paciente', v: 'Carlos Mendez (DNI 28.765.432)', d: 0 },
    { l: 'Fecha y Hora', v: 'Vie 27/03/2026 – 10:30 hs', d: 25 },
    { l: 'Tipo de Consulta', v: 'Consulta de Control', d: 50 },
    { l: 'Motivo', v: 'Revisión postoperatoria', d: 70 },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 16 }}>
      <div style={{ width: '100%', background: isDarkMode ? 'rgba(12,20,44,0.95)' : 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '16px 18px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
        <div style={{ color: isDarkMode ? 'white' : '#1e293b', fontWeight: 900, fontSize: 14, marginBottom: 12 }}>⏰ Nuevo Turno</div>
        {fields.map(({ l, v, d }) => {
          const chars = Math.min(v.length, Math.max(0, frame - d) * 2);
          return (
            <div key={l} style={{ marginBottom: 8 }}>
              <div style={{ color: '#64748b', fontSize: 9, fontWeight: 700, marginBottom: 2, textTransform: 'uppercase' }}>{l}</div>
              <div style={{ background: isDarkMode ? 'rgba(99,102,241,0.08)' : 'rgba(248,250,252,0.9)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, padding: '6px 10px', color: isDarkMode ? '#e2e8f0' : '#1e293b', fontSize: 11, fontWeight: 600 }}>
                {v.slice(0, chars)}{chars > 0 && chars < v.length && <span style={{ color: '#6366f1', opacity: 0.7 }}>|</span>}
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 12, padding: '9px', background: 'linear-gradient(135deg,#2563eb,#6366f1)', borderRadius: 10, color: 'white', fontWeight: 900, fontSize: 12, textAlign: 'center' }}>Confirmar Turno</div>
        {frame > 95 && <div style={{ marginTop: 6, padding: '6px 10px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10b981', fontSize: 10, fontWeight: 800, opacity: Math.min(1, (frame - 95) / 8) }}>✓ Turno agendado · Sincronizado con Google Calendar</div>}
      </div>
    </div>
  );
}

function ScreenReportes({ isDarkMode, frame }) {
  const bars = [{ l: 'Ene', v: 72, c: '#3b82f6' }, { l: 'Feb', v: 85, c: '#6366f1' }, { l: 'Mar', v: 91, c: '#8b5cf6' }, { l: 'Abr', v: 78, c: '#06b6d4' }, { l: 'May', v: 65, c: '#10b981' }, { l: 'Jun', v: 88, c: '#f59e0b' }];
  const barsProgress = Math.min(1, frame / 60);
  return (
    <div style={{ padding: '10px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ color: isDarkMode ? 'white' : '#1e293b', fontWeight: 900, fontSize: 13 }}>📊 Reportes y Estadísticas</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
        {[{ l: 'Pacientes', v: '247', c: '#3b82f6', e: '👤' }, { l: 'Turnos/mes', v: '91', c: '#6366f1', e: '📅' }, { l: 'Atendidos hoy', v: '12', c: '#10b981', e: '✅' }, { l: 'Pendientes', v: '5', c: '#f59e0b', e: '⏳' }].map(({ l, v, c, e }, i) => (
          <div key={i} style={{ background: isDarkMode ? 'rgba(15,23,42,0.7)' : 'rgba(248,250,252,0.9)', border: `1px solid ${c}25`, borderRadius: 10, padding: '8px 10px', opacity: Math.min(1, Math.max(0, (frame - i * 6) / 12)) }}>
            <div style={{ fontSize: 14 }}>{e}</div>
            <div style={{ color: c, fontWeight: 900, fontSize: 18 }}>{v}</div>
            <div style={{ color: '#64748b', fontSize: 9, marginTop: 1 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, background: isDarkMode ? 'rgba(15,23,42,0.7)' : 'rgba(248,250,252,0.9)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '10px 14px' }}>
        <div style={{ color: '#64748b', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>Consultas por Mes</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 70 }}>
          {bars.map(({ l, v, c }, i) => {
            const h = (v / 100) * 70 * barsProgress;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ width: '100%', height: h, background: `${c}60`, borderRadius: '4px 4px 0 0', border: `1px solid ${c}80`, transition: 'height 0.6s ease' }} />
                <div style={{ color: '#475569', fontSize: 8, fontWeight: 700 }}>{l}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScreenGestion({ isDarkMode, frame }) {
  const features = ['✓ Pacientes ilimitados', '✓ Agenda + Google Calendar', '✓ Historias clínicas', '✓ Estudios multimedia', '✓ Reportes & Estadísticas', '✓ Exportar PDF', '✓ Soporte prioritario'];
  return (
    <div style={{ padding: '10px 14px', height: '100%', display: 'flex', gap: 10 }}>
      <div style={{ flex: 1, background: isDarkMode ? 'rgba(15,23,42,0.7)' : 'rgba(248,250,252,0.9)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ color: '#64748b', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Plan Actual</div>
          <div style={{ padding: '3px 8px', background: 'linear-gradient(135deg,#c026d3,#7c3aed)', borderRadius: 20, color: 'white', fontSize: 8, fontWeight: 900 }}>PREMIUM</div>
        </div>
        <div style={{ color: isDarkMode ? 'white' : '#1e293b', fontWeight: 900, fontSize: 20, marginBottom: 2 }}>$25.000 <span style={{ color: '#64748b', fontSize: 10, fontWeight: 400 }}>ARS/mes</span></div>
        <div style={{ color: '#64748b', fontSize: 9, marginBottom: 10 }}>Próx. facturación: 26/04/2026</div>
        {features.map((f, i) => (
          <div key={i} style={{ color: '#86efac', fontSize: 10, fontWeight: 700, marginBottom: 4, opacity: Math.min(1, Math.max(0, (frame - i * 8) / 10)), transform: `translateX(${Math.max(0, (1 - Math.min(1, (frame - i * 8) / 10)) * 10)}px)` }}>{f}</div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[{ l: 'Consultorio', v: 'Consultorio Dr. Usuario', e: '🏥' }, { l: 'Horario', v: 'Lun–Vie: 08:00–18:00', e: '🕐' }, { l: 'Email', v: 'medicore.soporte@gmail.com', e: '📧' }, { l: 'Teléfono', v: '+54 9 11 5555-5555', e: '📞' }].map(({ l, v, e }, i) => (
          <div key={i} style={{ background: isDarkMode ? 'rgba(15,23,42,0.7)' : 'rgba(248,250,252,0.9)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 10px', opacity: Math.min(1, Math.max(0, (frame - i * 12) / 12)) }}>
            <div style={{ color: '#64748b', fontSize: 8, fontWeight: 700, marginBottom: 2 }}>{e} {l}</div>
            <div style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontSize: 10, fontWeight: 700 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCENE_SCREENS = {
  panel: ScreenPanel,
  crear: ScreenCrearPaciente,
  detalle: ScreenDetallePaciente,
  evolucion: ScreenEvolucion,
  agenda: ScreenAgenda,
  turno: ScreenTurno,
  reportes: ScreenReportes,
  gestion: ScreenGestion,
};

function DemoSection({ isDarkMode, onCta }) {
  const [step, setStep] = useState(0);
  const [frame, setFrame] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    // Frame counter for typing animations
    frameRef.current = setInterval(() => setFrame(f => f + 1), 40);
    return () => clearInterval(frameRef.current);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setStep(s => (s + 1) % DEMO_SCENES.length);
        setFrame(0);
        setFading(false);
      }, 400);
    }, SCENE_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [step]);

  const scene = DEMO_SCENES[step];
  const Screen = SCENE_SCREENS[scene.id];
  const SIDEBAR_ITEMS = ['Panel', 'Agenda', 'Pacientes', 'Recordatorios', 'Reportes', 'Gestión', 'Suscripción'];

  return (
    <section className={`py-24 px-6 overflow-hidden relative ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[80px] ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-400/15'}`}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className={`absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full blur-[80px] ${isDarkMode ? 'bg-indigo-600/20' : 'bg-indigo-400/15'}`}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <span className={`inline-flex items-center gap-2 py-1.5 px-4 rounded-full border text-xs font-bold tracking-widest uppercase mb-5 ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100/60 border-emerald-200 text-emerald-700'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Demo interactiva – Todas las secciones
          </span>
          <h2 className={`text-3xl md:text-4xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Mirá MediCore en acción
          </h2>
          <p className={`max-w-xl mx-auto text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Desde el panel hasta los reportes — cada funcionalidad diseñada para ahorrar tiempo.
          </p>
        </motion.div>

        {/* Scene pills nav */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {DEMO_SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setFading(true); setTimeout(() => { setStep(i); setFrame(0); setFading(false); clearTimeout(timerRef.current); }, 300); }}
              className="transition-all"
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                border: `1px solid ${i === step ? s.color : 'rgba(148,163,184,0.2)'}`,
                background: i === step ? `${s.color}20` : 'transparent',
                color: i === step ? s.color : isDarkMode ? '#64748b' : '#94a3b8',
                fontSize: 11,
                fontWeight: i === step ? 800 : 600,
                cursor: 'pointer',
              }}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>

        {/* Browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Floating scene badge */}
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute -top-5 -right-4 z-20 px-4 py-2 rounded-2xl text-xs font-black shadow-2xl border`}
            style={{
              background: isDarkMode ? 'rgba(15,23,42,0.95)' : 'white',
              border: `1px solid ${scene.color}40`,
              color: scene.color,
            }}
          >
            {scene.emoji} {scene.label}
          </motion.div>

          {/* Browser frame */}
          <div className={`rounded-2xl overflow-hidden shadow-2xl border`} style={{ background: isDarkMode ? 'rgb(15,23,42)' : '#f1f5f9', borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }}>
            {/* Title bar */}
            <div className={`flex items-center gap-2 px-4 py-3 border-b`} style={{ background: isDarkMode ? 'rgb(20,30,55)' : 'white', borderColor: isDarkMode ? 'rgba(255,255,255,0.07)' : '#e2e8f0' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene.url}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className={`flex-1 mx-3 py-1 px-3 rounded-lg text-[11px] font-mono`}
                  style={{ background: isDarkMode ? 'rgba(30,41,59,0.6)' : '#f8fafc', color: isDarkMode ? '#64748b' : '#94a3b8' }}
                >
                  app.medicore.com.ar{scene.url}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* App body: sidebar + content */}
            <div className="flex" style={{ height: '400px' }}>
              {/* Sidebar */}
              <div className="flex-shrink-0 flex flex-col py-3 px-2 gap-1" style={{ width: 148, background: isDarkMode ? 'rgba(10,16,38,0.97)' : '#f8fafc', borderRight: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
                {/* Logo */}
                <div className="flex items-center gap-2 px-2 py-1 mb-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#2563eb,#6366f1)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>
                  </div>
                  <span style={{ color: isDarkMode ? 'white' : '#1e293b', fontWeight: 900, fontSize: 13 }}>MediCore</span>
                </div>
                {/* User */}
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg mb-1" style={{ background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-white flex-shrink-0 text-[9px] font-black" style={{ background: 'linear-gradient(135deg,#2563eb,#6366f1)' }}>UP</div>
                  <div><div style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontSize: 10, fontWeight: 800 }}>Dr/a. Usuario</div><div style={{ color: '#6366f1', fontSize: 8, fontWeight: 700 }}>Premium</div></div>
                </div>
                {SIDEBAR_ITEMS.map((item, i) => {
                  const isActive = scene.label.includes(item) || (scene.id === 'panel' && item === 'Panel') || (scene.id === 'crear' && item === 'Pacientes') || (scene.id === 'detalle' && item === 'Pacientes') || (scene.id === 'evolucion' && item === 'Pacientes') || (scene.id === 'agenda' && item === 'Agenda') || (scene.id === 'turno' && item === 'Agenda') || (scene.id === 'reportes' && item === 'Reportes') || (scene.id === 'gestion' && item === 'Gestión');
                  return (
                    <div key={i} style={{ padding: '6px 8px', borderRadius: 8, background: isActive ? `${scene.color}20` : 'transparent', border: `1px solid ${isActive ? scene.color + '40' : 'transparent'}`, color: isActive ? scene.color : isDarkMode ? '#64748b' : '#94a3b8', fontSize: 10, fontWeight: isActive ? 800 : 600 }}>{item}</div>
                  );
                })}
              </div>

              {/* Content area */}
              <div className="flex-1 relative overflow-hidden" style={{ background: isDarkMode ? 'rgb(5,12,30)' : '#f8fafc' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: fading ? 0 : 1, x: fading ? -20 : 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    <Screen isDarkMode={isDarkMode} frame={frame} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className={`flex gap-1.5 justify-center mt-5`}>
            {DEMO_SCENES.map((s, i) => (
              <motion.div
                key={i}
                animate={{ width: i === step ? 28 : 8, opacity: i === step ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full cursor-pointer"
                style={{ background: i === step ? scene.color : isDarkMode ? '#334155' : '#cbd5e1' }}
                onClick={() => { setFading(true); setTimeout(() => { setStep(i); setFrame(0); setFading(false); }, 300); }}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onCta}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-[0_8px_30px_-4px_rgba(79,70,229,0.45)] hover:shadow-[0_12px_40px_-4px_rgba(79,70,229,0.6)] transition-shadow"
          >
            Probalo gratis por 30 días →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
