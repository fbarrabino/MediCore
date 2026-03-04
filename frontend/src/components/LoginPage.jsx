import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

/* SVG Icon Components */
const HeartPulseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* Animated background blob */
const Blob = ({ className, style, animClass }) => (
  <div
    className={`absolute rounded-full pointer-events-none ${animClass} ${className}`}
    style={style}
  />
);

/* Stagger variants */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const LoginPage = ({ onLogin, isModal, onClose, onSwitchToRegister, onForgotPassword }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isVerified = searchParams.get('verified') === 'true';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Por favor, ingrese usuario y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('token', data.token); // Guardar JWT
        toast.success('¡Acceso autorizado!');
        onLogin(data.usuario);
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          setErrorMsg(errorJson.error || errorJson.message || 'Usuario o Contraseña Incorrecto/s');
        } catch (e) {
          setErrorMsg('Usuario o Contraseña Incorrecto/s');
        }
      }
    } catch {
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isModal ? '' : 'min-h-screen relative flex items-center justify-center overflow-hidden p-4'}`}
      style={isModal ? {} : { background: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 70%, #0c1445 100%)' }}
    >
      {!isModal && (
        <>
          {/* Animated background blobs */}
          <Blob
            animClass="anim-float"
            className="w-[520px] h-[520px] -top-32 -left-32 anim-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <Blob
            animClass="anim-float2"
            className="w-[420px] h-[420px] -bottom-20 -right-20"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.30) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
          <Blob
            animClass="anim-float3"
            className="w-[280px] h-[280px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </>
      )}

      {/* Login Card */}
      <motion.div
        initial={isModal ? { opacity: 0, scale: 0.9, y: 20 } : { opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`glass-card relative w-full max-w-[400px] rounded-3xl overflow-hidden z-10 ${isModal ? 'shadow-2xl' : ''}`}
        style={isModal ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' } : {}}
      >
        {isModal && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
          >
            ✕
          </button>
        )}
        {/* Top gradient accent bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)' }} />

        {!isModal && (
          <Link to="/" className="absolute top-5 left-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-1 z-[60] bg-slate-900/50 py-1.5 px-3 rounded-full hover:bg-slate-800 border border-white/5">
            ← Volver al Inicio
          </Link>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-10"
        >
          {isVerified && (
            <motion.div variants={itemVariants} className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="text-green-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-sm font-medium text-green-100">
                ¡Cuenta registrada y verificada exitosamente! Ya puedes iniciar sesión.
              </p>
            </motion.div>
          )}

          {/* Logo & Brand */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 mx-auto"
              style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(99,102,241,0.3))', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div className="w-8 h-8 text-blue-600">
                <HeartPulseIcon />
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-1">
              Medi<span style={{ background: 'linear-gradient(135deg, #60a5fa, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Core</span>
            </h1>
            <p className="text-blue-300/70 font-medium text-sm tracking-wide">
              Gestión Clínica de Vanguardia
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Username */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-widest mb-2 ml-1">
                Usuario
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusField === 'user' ? 'text-blue-400' : 'text-slate-500'}`}>
                  <UserIcon />
                </div>
                <input
                  type="text"
                  autoComplete="off"
                  className={`w-full pl-11 pr-4 py-4 rounded-2xl text-white font-medium placeholder-slate-500 transition-all duration-200 outline-none ${errorMsg ? 'ring-2 ring-red-500/60' : focusField === 'user' ? 'ring-2 ring-blue-500/60' : ''}`}
                  style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${focusField === 'user' ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}` }}
                  placeholder=""
                  value={username}
                  onFocus={() => setFocusField('user')}
                  onBlur={() => setFocusField(null)}
                  onChange={(e) => { setUsername(e.target.value); setErrorMsg(''); }}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-end mb-2 ml-1">
                <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-widest">
                  Contraseña
                </label>
                {!isModal ? (
                  <Link
                     to="/" /* Redirigimos al home porque no hay ruta /forgot-password aislada aún */
                     className="text-[10px] relative z-[60] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    ¿Olvidaste tu clave?
                  </Link>
                ) : (
                  <button
                     type="button"
                     onClick={onForgotPassword}
                     className="text-[10px] relative z-[60] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    ¿Olvidaste tu clave?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusField === 'pass' ? 'text-blue-400' : 'text-slate-500'}`}>
                  <LockIcon />
                </div>
                <input
                  type="password"
                  autoComplete="off"
                  className={`w-full pl-11 pr-4 py-4 rounded-2xl text-white font-medium placeholder-slate-500 transition-all duration-200 outline-none ${errorMsg ? 'ring-2 ring-red-500/60' : focusField === 'pass' ? 'ring-2 ring-blue-500/60' : ''}`}
                  style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${focusField === 'pass' ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}` }}
                  placeholder=""
                  value={password}
                  onFocus={() => setFocusField('pass')}
                  onBlur={() => setFocusField(null)}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                />
              </div>
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-300"
                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <span>⚠</span> {errorMsg}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={loading}
                className="premium-btn w-full text-white font-bold py-4 rounded-2xl tracking-wide text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    Verificando acceso...
                  </span>
                ) : 'Ingresar al Sistema'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Footer badge */}
        <div className="px-10 pb-8 text-center space-y-4">
          <p className="text-sm font-medium text-slate-400">
            ¿No tienes cuenta?{' '}
            {!isModal ? (
              <Link
                 to="/registro"
                 className="text-blue-400 font-black hover:text-blue-300 transition-colors relative z-[60]"
              >
                Registrarse
              </Link>
            ) : (
              <button
                 type="button"
                 onClick={onSwitchToRegister}
                 className="text-blue-400 font-black hover:text-blue-300 transition-colors relative z-[60]"
              >
                Registrarse
              </button>
            )}
          </p>
          <p className="text-xs text-slate-600 font-medium pt-2 border-t border-white/5">
            🔒 Acceso seguro · JWT Encriptado · Multi-Tenant
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
