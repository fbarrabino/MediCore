import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';

/* SVG Icons */
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

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const BadgeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
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
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const RegistroPage = ({ isModal, onClose, onSwitchToLogin }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nombre || !formData.apellido || !formData.username || !formData.email || !formData.password) {
      setErrorMsg('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.info('Correo de verificación enviado.');
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          setErrorMsg(errorJson.error || errorJson.message || 'Error al registrar el usuario.');
        } catch (e) {
          setErrorMsg(errorText || 'Error al registrar el usuario.');
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
          <Blob animClass="anim-float" className="w-[520px] h-[520px] -top-32 -left-32 anim-pulse-glow" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <Blob animClass="anim-float2" className="w-[420px] h-[420px] -bottom-20 -right-20" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.30) 0%, transparent 70%)', filter: 'blur(50px)' }} />
          <Blob animClass="anim-float3" className="w-[280px] h-[280px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(30px)' }} />

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        </>
      )}

      {/* Register Card */}
      <motion.div
        initial={isModal ? { opacity: 0, scale: 0.9, y: 20 } : { opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`glass-card relative w-full max-w-[480px] rounded-3xl overflow-hidden z-10 ${isModal ? 'shadow-2xl' : ''}`}
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
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)' }} />

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 sm:p-10">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 mx-auto cursor-pointer" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(99,102,241,0.3))', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div className="w-7 h-7 text-blue-400">
                <HeartPulseIcon />
              </div>
            </Link>
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2">Crear Cuenta</h1>
            <p className="text-blue-300/70 font-medium text-sm tracking-wide">Únete a MediCore hoy mismo.</p>
          </motion.div>

          {isSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4 border border-green-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">¡Cuenta creada!</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Por favor, revisa tu bandeja de entrada o spam para verificar tu email.
              </p>
              <button 
                onClick={isModal ? onSwitchToLogin : () => navigate('/login')} 
                className="premium-btn w-full text-white font-bold py-3.5 rounded-xl tracking-wide text-sm"
              >
                Ir al Login
              </button>
            </motion.div>
          ) : (
            <>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Nombre */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-widest mb-1.5 ml-1">Nombre</label>
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusField === 'nombre' ? 'text-blue-400' : 'text-slate-500'}`}><BadgeIcon /></div>
                      <input type="text" name="nombre" autoComplete="off" className={`w-full pl-9 pr-3 py-3 rounded-xl text-white text-sm font-medium placeholder-slate-500 transition-all duration-200 outline-none ${errorMsg ? 'ring-2 ring-red-500/60' : focusField === 'nombre' ? 'ring-2 ring-blue-500/60' : ''}`} style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${focusField === 'nombre' ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}` }} placeholder="" value={formData.nombre} onFocus={() => setFocusField('nombre')} onBlur={() => setFocusField(null)} onChange={handleChange} />
                    </div>
                  </motion.div>
                  {/* Apellido */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-widest mb-1.5 ml-1">Apellido</label>
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusField === 'apellido' ? 'text-blue-400' : 'text-slate-500'}`}><BadgeIcon /></div>
                      <input type="text" name="apellido" autoComplete="off" className={`w-full pl-9 pr-3 py-3 rounded-xl text-white text-sm font-medium placeholder-slate-500 transition-all duration-200 outline-none ${errorMsg ? 'ring-2 ring-red-500/60' : focusField === 'apellido' ? 'ring-2 ring-blue-500/60' : ''}`} style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${focusField === 'apellido' ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}` }} placeholder="" value={formData.apellido} onFocus={() => setFocusField('apellido')} onBlur={() => setFocusField(null)} onChange={handleChange} />
                    </div>
                  </motion.div>
                </div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusField === 'email' ? 'text-blue-400' : 'text-slate-500'}`}><MailIcon /></div>
                    <input type="email" name="email" autoComplete="off" className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-white font-medium placeholder-slate-500 transition-all duration-200 outline-none ${errorMsg ? 'ring-2 ring-red-500/60' : focusField === 'email' ? 'ring-2 ring-blue-500/60' : ''}`} style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${focusField === 'email' ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}` }} placeholder="" value={formData.email} onFocus={() => setFocusField('email')} onBlur={() => setFocusField(null)} onChange={handleChange} />
                  </div>
                </motion.div>

                {/* Username */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-widest mb-1.5 ml-1">Usuario</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusField === 'username' ? 'text-blue-400' : 'text-slate-500'}`}><UserIcon /></div>
                    <input type="text" name="username" autoComplete="off" className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-white font-medium placeholder-slate-500 transition-all duration-200 outline-none ${errorMsg ? 'ring-2 ring-red-500/60' : focusField === 'username' ? 'ring-2 ring-blue-500/60' : ''}`} style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${focusField === 'username' ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}` }} placeholder="" value={formData.username} onFocus={() => setFocusField('username')} onBlur={() => setFocusField(null)} onChange={handleChange} />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-widest mb-1.5 ml-1">Contraseña</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusField === 'password' ? 'text-blue-400' : 'text-slate-500'}`}><LockIcon /></div>
                    <input type="password" name="password" className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-white font-medium placeholder-slate-500 transition-all duration-200 outline-none ${errorMsg ? 'ring-2 ring-red-500/60' : focusField === 'password' ? 'ring-2 ring-blue-500/60' : ''}`} style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${focusField === 'password' ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}` }} placeholder="••••••••" value={formData.password} onFocus={() => setFocusField('password')} onBlur={() => setFocusField(null)} onChange={handleChange} />
                  </div>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 mt-2 rounded-xl text-xs font-semibold text-red-300" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                        <span>⚠</span> {errorMsg}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.div variants={itemVariants} className="pt-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} type="submit" disabled={loading} className="premium-btn w-full text-white font-bold py-3.5 rounded-xl tracking-wide text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? 'Registrando...' : 'Crear Cuenta'}
                  </motion.button>
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  ¿Ya tienes una cuenta?{' '}
                  {isModal ? (
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors bg-transparent border-none p-0"
                    >
                      Inicia sesión aquí
                    </button>
                  ) : (
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors">
                      Inicia sesión aquí
                    </Link>
                  )}
                </p>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegistroPage;
