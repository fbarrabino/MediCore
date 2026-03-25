import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      // API call to backend
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSent(true);
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          setErrorMsg(errorJson.error || 'Error al procesar la solicitud');
        } catch {
          setErrorMsg(errorText || 'Error al procesar la solicitud');
        }
      }
    } catch (err) {
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`glass-card relative w-full max-w-[400px] rounded-3xl overflow-hidden z-10 p-8 shadow-2xl`}
            style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all z-20"
            >
              ✕
            </button>

            {!sent ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                    <span className="text-3xl text-blue-400">🔑</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">Recuperar Clave</h2>
                  <p className="text-slate-400 text-sm">
                    Ingresa tu correo electrónico registrado para enviarte un enlace de recuperación.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-widest mb-2 ml-1">
                      Email de Registro
                    </label>
                    <input
                      type="email"
                      required
                      className={`w-full px-4 py-4 rounded-2xl text-white font-medium placeholder-slate-500 outline-none transition-all ${errorMsg ? 'ring-2 ring-red-500/60' : 'focus:ring-2 focus:ring-blue-500/60'}`}
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg(null); }}
                    />
                  </div>

                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 mt-1 rounded-xl text-sm font-semibold text-red-300" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                          <span>⚠</span> {errorMsg}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading}
                    className="premium-btn w-full text-white font-bold py-4 rounded-2xl tracking-wide disabled:opacity-50 transition-all mt-2"
                  >
                    {loading ? 'Consultando...' : 'Enviar Link de Recuperación'}
                  </button>
                </form>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-5 border border-green-500/30">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-black text-white mb-3">¡Correo Enviado!</h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-8">
                  Te hemos enviado un enlace de recuperación. Por favor, revisa tu correo electrónico (incluyendo la carpeta de spam).
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-700 transition-all border border-white/5"
                >
                  Entendido, volver
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
