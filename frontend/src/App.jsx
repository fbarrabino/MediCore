import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Outlet, useLocation, Link, useOutletContext } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegistroPage from './components/RegistroPage';
import SuscripcionPage from './components/SuscripcionPage';
import { buscarPacientePorDni, obtenerTodosLosPacientes } from './services/pacienteService';
import { imprimirHistoriaClinica } from './components/ExportarPDF';
import NuevoPacienteModal from './components/NuevoPacienteModal';
import PanelTurnos from './components/PanelTurnos';
import PacienteDetalle from './components/PacienteDetalle';
import AgendaView from './components/AgendaView';
import ReportesView from './components/ReportesView';
import GestionView from './components/GestionView';
import SuscripcionPanelView from './components/SuscripcionPanelView';
import RecordatoriosView from './components/RecordatoriosView';
import Footer from './components/Footer';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { ThemeProvider, useTheme } from './ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

/* ---- Icon helpers ---- */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
  </svg>
);
const PrintIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect width="12" height="8" x="6" y="14"/>
  </svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

/* Derive initials from user object */
const getInitials = (user) => {
  if (!user) return '??';
  const n = (user.nombre || '').charAt(0).toUpperCase();
  const a = (user.apellido || '').charAt(0).toUpperCase();
  return `${n}${a}` || '??';
};

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('medicore_user')) || null; }
    catch { return null; }
  });

  const handleLogoutGlobal = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('medicore_user');
    sessionStorage.removeItem('medicore_paciente');
    setUser(null);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage onLogin={setUser} />} />
          <Route path="/login" element={user ? <Navigate to="/panel" replace /> : <LoginRoute onLogin={setUser} />} />
          <Route path="/registro" element={user ? <Navigate to="/panel" replace /> : <RegistroPage />} />
          <Route path="/suscripcion" element={user ? <SuscripcionPage onLogout={handleLogoutGlobal} /> : <Navigate to="/login" replace />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          <Route path="/panel" element={user ? <AppContent user={user} setUser={setUser} /> : <Navigate to="/login" replace />}>
            <Route index element={<DashboardView />} />
            <Route path="agenda" element={<AgendaView />} />
            <Route path="pacientes" element={<PacientesView />} />
            <Route path="paciente/:id" element={<PacienteDetalle />} />
            <Route path="reportes" element={<ReportesView />} />
            <Route path="gestion" element={<GestionView />} />
            <Route path="suscripcion" element={<SuscripcionPanelView />} />
            <Route path="recordatorios" element={<RecordatoriosView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function LoginRoute({ onLogin }) {
  const navigate = useNavigate();
  return <LoginPage onLogin={(u) => { 
    sessionStorage.setItem('medicore_user', JSON.stringify(u));
    onLogin(u); 
    navigate('/panel'); 
  }} />;
}

function AppContent({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  // --- ESCALA SIDEBAR ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- PERSISTENCIA DE SESIÓN DENTRO DE PANEL ---
  const [paciente, setPaciente] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('medicore_paciente')) || null; }
    catch { return null; }
  });

  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listaPacientesGlobal, setListaPacientesGlobal] = useState([]);
  const [showTrialBanner, setShowTrialBanner] = useState(false);

  // Determinar si la cuenta es solo-lectura (plan expirado sin pago activo)
  const planActual = user?.planActual || 'PRUEBA';
  const esPrueba = planActual === 'PRUEBA';
  const esBasico = planActual === 'BASICO';
  const esPremium = planActual === 'PREMIUM';
  
  const fechaFin = user?.fechaFinSuscripcion ? new Date(user.fechaFinSuscripcion) : null;
  const hoy = new Date();
  // Solo lectura si el trial expiró siendo PRUEBA (sin haber pagado aún)
  // O si el plan (BASICO/PREMIUM) marcó estadoPago como VENCIDO
  const soloLectura = !!(user && (
    (esPrueba && fechaFin && hoy > fechaFin) ||
    user.estadoPago === 'VENCIDO'
  ));

  useEffect(() => {
    if (user) sessionStorage.setItem('medicore_user', JSON.stringify(user));
    else { sessionStorage.removeItem('medicore_user'); sessionStorage.removeItem('medicore_paciente'); }
  }, [user]);

  useEffect(() => {
    if (paciente) sessionStorage.setItem('medicore_paciente', JSON.stringify(paciente));
    else sessionStorage.removeItem('medicore_paciente');
  }, [paciente]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (user && token) {
      obtenerTodosLosPacientes()
        .then(data => setListaPacientesGlobal(data))
        .catch(() => { /* Catch silencioso para evitar ensuciar la consola con el 401 */ });
    }
  }, [user, refreshTrigger]);

  // Mostrar banner de bienvenida al trial (solo una vez, si no fue visto aún)
  useEffect(() => {
    if (user && user.planActual === 'PRUEBA' && !user.trialBannerMostrado) {
      const token = sessionStorage.getItem('token');
      // Marcar como visto en el backend
      if (token) {
        fetch('http://localhost:8080/api/auth/trial-banner-visto', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        }).catch(() => {});
      }
      // Pequeño delay para que el panel cargue primero
      const t = setTimeout(() => setShowTrialBanner(true), 800);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('medicore_user');
    sessionStorage.removeItem('medicore_paciente');
    window.location.href = '/';
  };

  // --- LÓGICA DE BLOQUEO "EL PATOVICA" ---
  // SuperAdmin (franco.admin) → acceso ilimitado, nunca bloqueado
  const esSuperAdmin = user?.superAdmin === true || user?.username === 'franco.admin';
  // Redirige a /suscripcion cuando la prueba expiró (solo para plan PRUEBA, NO superAdmin)
  if (!esSuperAdmin && user && esPrueba && fechaFin && hoy > fechaFin) {
    return <Navigate to="/suscripcion" replace />;
  }
  // Si pagó y su suscripción venció (BASICO/PREMIUM vencidos)
  if (!esSuperAdmin && user && !esPrueba && user.estadoPago === 'VENCIDO') {
    return <Navigate to="/suscripcion" replace />;
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!dni) return;
    setLoading(true);
    setPaciente(null);
    try {
      const data = await buscarPacientePorDni(dni, user.id);
      if (data) {
        navigate('/panel/paciente/' + data.id);
      } else {
        toast.error('Paciente no encontrado en la base de datos.');
      }
    } catch {
      toast.error('Error al conectar con el servidor de MediCore.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvolucionGuardada = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Guardado con éxito', { className: 'border border-green-500' });
  };

  const handlePacienteCreado = (nuevoPaciente) => {
    setPaciente(nuevoPaciente);
    if (location.pathname !== '/panel') navigate('/panel');
  };



  /* ---- Color tokens ---- */
  const surface = isDarkMode
    ? 'bg-slate-900/60 border-slate-700/60'
    : 'bg-white/80 border-slate-200/80';
  const cardBg = isDarkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white border-slate-200';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDarkMode
    ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500'
    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400';

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30'}`}>
      <ToastContainer
        position="top-right" autoClose={3000} hideProgressBar={false}
        newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover
        theme={isDarkMode ? 'dark' : 'light'}
      />

      {/* ======== SIDEBAR ======== */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 border-r flex flex-col transition-all duration-300 h-screen sticky top-0 ${surface}`}>
        {/* Logo / Sidebar Header */}
        <div className={`p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} min-h-[85px]`}>
          <div
            onClick={() => { setPaciente(null); setDni(''); navigate('/panel'); }}
            className={`cursor-pointer group flex items-center gap-3 select-none ${isSidebarOpen ? '' : 'hidden'}`}
            title="Volver al inicio"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-600 group-hover:text-indigo-600 transition-colors shrink-0"
              style={{ background: isDarkMode ? 'rgba(37,99,235,0.18)' : 'rgba(37,99,235,0.1)' }}>
              <HeartPulseIcon />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xl font-black tracking-tight leading-none whitespace-nowrap">
                <span className="gradient-text">MediCore</span>
              </h1>
              <p className={`text-[10px] font-bold uppercase tracking-[0.18em] whitespace-nowrap ${textMuted}`}>App Médica</p>
            </div>
          </div>
          
          {/* Toggle Sidebar Button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isSidebarOpen ? '' : 'mx-auto'}`}
            title={isSidebarOpen ? "Colapsar menú" : "Expandir menú"}
          >
            {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* User Info */}
        <div className={`p-6 pb-2 border-b border-slate-200/50 dark:border-slate-800/50 ${isSidebarOpen ? '' : 'flex justify-center'}`}>
          <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'flex-col'}`}>
            <div className="w-10 h-10 rounded-xl font-black text-sm text-white flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}>
              {getInitials(user)}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className={`font-bold text-sm leading-tight truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  Dr/a. {user.nombre}
                </p>
                <p className={`text-xs truncate ${textMuted}`}>{user.apellido}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { path: '/panel', icon: <HomeIcon />, label: 'Panel Principal', allowed: true },
            { path: '/panel/agenda', icon: <CalendarIcon />, label: 'Agenda', allowed: !esBasico },
            { path: '/panel/pacientes', icon: <UsersIcon />, label: 'Pacientes', allowed: true },
            { path: '/panel/recordatorios', icon: <BellIcon />, label: 'Recordatorios', allowed: !esBasico },
            { path: '/panel/reportes', icon: <ChartIcon />, label: 'Reportes y Est.', allowed: true },
            { path: '/panel/gestion', icon: <SettingsIcon />, label: 'Gestión Consultorio', allowed: true },
            { path: '/panel/suscripcion', icon: <CreditCardIcon />, label: 'Suscripción/Pagos', allowed: true }
          ].map(item => {
            if (!item.allowed) {
              // Item bloqueado para plan BÁSICO
              return (
                <div
                  key={item.path}
                  title="Disponible en Plan Premium"
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold opacity-40 cursor-not-allowed select-none ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  } ${isSidebarOpen ? '' : 'justify-center'}`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {isSidebarOpen && (
                    <span className="whitespace-nowrap flex items-center gap-1.5">
                      {item.label}
                      <span className="text-[9px] bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide">Premium</span>
                    </span>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold transition-all ${
                  location.pathname === item.path
                    ? (isDarkMode ? 'bg-blue-600/20 text-white shadow-sm' : 'bg-blue-50 text-blue-700 shadow-sm')
                    : (isDarkMode ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-100/80 text-slate-600 hover:text-slate-900')
                } ${isSidebarOpen ? '' : 'justify-center'}`}
                title={item.label}
              >
                <div className="shrink-0">{item.icon}</div>
                {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Action Bottom */}
        <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold transition-all ${isDarkMode ? 'hover:bg-red-500/10 text-red-500 hover:text-red-400' : 'hover:bg-red-50 text-red-600 hover:text-red-700'} ${isSidebarOpen ? '' : 'justify-center'}`}
            title="Cerrar Sesión"
          >
            <div className="shrink-0"><LogoutIcon /></div>
            {isSidebarOpen && <span className="whitespace-nowrap">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* ======== MAIN CONTENT ======== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header bar (Theme toggle & mobile menu hook mostly) */}
        <header className="flex justify-end lg:justify-end items-center px-6 md:px-10 py-4 z-40">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-yellow-400' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
            title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto w-full px-4 md:px-8 py-2 pb-8 custom-scrollbar relative">
          
          <Outlet context={{
            paciente, setPaciente,
            isDarkMode, textMuted, inputBg, cardBg,
            dni, setDni,
            handleSearch, loading, setIsModalOpen,
            refreshTrigger, handleEvolucionGuardada,
            user, planActual, soloLectura, esBasico, esPremium,
            listaPacientesGlobal
          }} />

        </main>

      <NuevoPacienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPacienteCreado={handlePacienteCreado}
        soloLectura={soloLectura}
        planActual={planActual}
      />

      {/* ── TRIAL WELCOME BANNER ── */}
      <AnimatePresence>
        {showTrialBanner && (
          <motion.div
            key="trial-banner"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(10px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowTrialBanner(false); }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 60%, #4f46e5 100%)' }}
            >
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }} />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }} />

              <div className="relative p-8">
                {/* Icon */}
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    🎉
                  </div>
                </div>

                <h2 className="text-white font-black text-2xl text-center mb-2 leading-tight">
                  ¡Bienvenido/a a MediCore!
                </h2>
                <p className="text-blue-200 text-sm text-center mb-1 font-medium">
                  Tu período de prueba gratuita de <strong className="text-white">30 días</strong> ha comenzado.
                </p>
                <p className="text-blue-300/70 text-xs text-center mb-6">
                  Explorá todas las funciones sin restricciones. Al finalizar, elegirás tu plan.
                </p>

                {/* Features list */}
                <div className="space-y-2 mb-6">
                  {[
                    '✓ Pacientes ilimitados durante el trial',
                    '✓ Agenda y recordatorios automáticos',
                    '✓ Historias clínicas y estudios',
                    '✓ Reportes y estadísticas',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-blue-100 font-medium">
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowTrialBanner(false)}
                  className="w-full py-3.5 rounded-2xl font-black text-blue-900 shadow-xl transition-all"
                  style={{ background: 'linear-gradient(135deg, #e0f2fe, #fff)' }}
                >
                  ¡Empezar a usar MediCore! 🚀
                </motion.button>

                <p className="text-blue-400/60 text-xs text-center mt-3">
                  Tu prueba vence el {user?.fechaFinSuscripcion ? new Date(user.fechaFinSuscripcion).toLocaleDateString('es-AR') : ''}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}

export default App;

/* =========================================
   SUB-VIEWS PARA EL DASHBOARD (OUTLET)
========================================= */

function DashboardView() {
  const {
    paciente, setPaciente,
    isDarkMode, textMuted, inputBg,
    dni, setDni,
    handleSearch, loading, setIsModalOpen,
    refreshTrigger, handleEvolucionGuardada,
    user, listaPacientesGlobal
  } = useOutletContext();

  const navigate = useNavigate();

  // Búsqueda en vivo
  const sugerencias = dni.length > 0 
    ? listaPacientesGlobal.filter(p => p.dni.includes(dni) || p.nombre.toLowerCase().includes(dni.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto pt-4">
      {/* Search + New Patient Bar (Centered and smaller) */}
      <motion.form
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onSubmit={handleSearch}
        className="w-full max-w-2xl flex flex-col md:flex-row gap-3 mb-10 relative"
        autoComplete="off"
      >
        <div className="relative flex-1">
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`}>
            <SearchIcon />
          </div>
          <input
            type="text" autoComplete="off"
            placeholder="Buscar por DNI o Nombre..."
            className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-bold text-sm ${
              isDarkMode 
                ? 'bg-slate-900/50 border-slate-800 text-white placeholder-slate-600 focus:border-blue-500/50' 
                : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-300'
            }`}
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />

          {/* Sugerencias en vivo */}
          <AnimatePresence>
            {sugerencias.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border shadow-2xl overflow-hidden ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                }`}
              >
                {sugerencias.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setPaciente(p);
                      setDni('');
                      navigate('/panel/paciente/' + p.id);
                    }}
                    className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-colors ${
                      isDarkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-blue-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-black text-xs shadow-sm">
                        {p.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{p.nombre}</p>
                        <p className="text-[10px] opacity-60 font-black uppercase tracking-widest">DNI: {p.dni}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Ver Perfil →</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
            type="submit"
            className="premium-btn text-white px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap disabled:opacity-60 flex-1 md:flex-none"
            disabled={loading}
          >
            {loading ? '...' : 'Buscar'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={`px-5 py-3.5 rounded-2xl font-bold border-2 transition-all whitespace-nowrap flex-1 md:flex-none ${isDarkMode
              ? 'bg-slate-800 text-blue-400 border-slate-700 hover:border-blue-500 hover:bg-slate-700'
              : 'bg-white text-blue-700 border-blue-100 hover:border-blue-300 hover:bg-blue-50'}`}
          >
            + Nuevo Paciente
          </motion.button>
        </div>
      </motion.form>

      {/* Panel de Hoy – Turnos */}
      <div className="w-full">
        <PanelTurnos />
      </div>
    </div>
  );
}

function PacientesView() {
  const { setPaciente, isDarkMode, cardBg } = useOutletContext();
  const navigate = useNavigate();
  const [listaPacientes, setListaPacientes] = useState([]);
  const [cargandoPacientes, setCargandoPacientes] = useState(true);
  const [orden, setOrden] = useState('reciente');

  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  useEffect(() => {
    obtenerTodosLosPacientes()
      .then(data => setListaPacientes(data))
      .catch(() => toast.error('Error al cargar la lista de pacientes.'))
      .finally(() => setCargandoPacientes(false));
  }, []);

  const pacientesFiltrados = listaPacientes.filter(pac => 
    pac.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) || 
    pac.dni.includes(filtroBusqueda)
  );

  const pacientesOrdenados = [...pacientesFiltrados].sort((a, b) => {
    if (orden === 'alfabetico') return a.nombre.localeCompare(b.nombre);
    if (orden === 'dni') return a.dni.localeCompare(b.dni);
    return b.id - a.id;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-6">
        <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Directorio de Pacientes</h2>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Consulta y gestiona todos los pacientes registrados en tu clínica.</p>
      </div>

      <div className={`p-6 rounded-3xl border shadow-xl ${cardBg}`}>
        {/* Controles: Ordenamiento y Búsqueda */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Ordenamiento pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar w-full md:w-auto">
            {[
              { key: 'reciente', label: '⏱ Recientes' },
              { key: 'alfabetico', label: '🔤 A–Z' },
              { key: 'dni', label: '🔢 DNI' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setOrden(key)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                  orden === key
                    ? (isDarkMode ? 'text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg')
                    : isDarkMode ? 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                style={orden === key && isDarkMode ? { background: 'linear-gradient(135deg, #2563eb, #6366f1)', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Barra de búsqueda integrada */}
          <div className="relative w-full md:w-80">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Buscar por Nombre o DNI..."
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-bold outline-none transition-all focus:ring-4 focus:ring-blue-500/10 ${
                isDarkMode 
                  ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500/50' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-300'
              }`}
            />
          </div>
        </div>

        {/* Grid de pacientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cargandoPacientes ? (
            <div className="col-span-full text-center py-20 text-slate-500 font-bold">
              <div className="inline-block animate-spin text-4xl mb-4 text-blue-500 text-[32px]">⟳</div>
              <p className="uppercase tracking-widest text-xs">Cargando base de datos...</p>
            </div>
          ) : pacientesOrdenados.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No se encontraron pacientes</p>
            </div>
          ) : (
            pacientesOrdenados.map((pac) => (
              <motion.div
                key={pac.id}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/panel/paciente/' + pac.id)}
                className={`p-6 rounded-2xl cursor-pointer transition-all border group shadow-sm hover:shadow-xl ${isDarkMode
                  ? 'bg-slate-800/40 border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800'
                  : 'bg-white border-slate-100 hover:border-blue-200'}`}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl text-white text-xl font-black flex items-center justify-center shrink-0 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                    {pac.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className={`font-black text-lg leading-snug truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{pac.nombre}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DNI: {pac.dni}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>

  );
}