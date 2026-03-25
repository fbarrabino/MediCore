import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nuevaPassword: password })
      });

      if (response.ok) {
        setSuccess(true);
        toast.success('Contraseña actualizada con éxito');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(errorJson.error || 'Error al actualizar la contraseña');
        } catch {
          toast.error(errorText || 'Error al actualizar la contraseña');
        }
      }
    } catch (err) {
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-center items-center justify-center p-6 text-center">
        <div className="glass-card p-10 rounded-3xl max-w-md w-full border border-white/10">
          <h2 className="text-2xl font-black text-white mb-4">Token Inválido</h2>
          <p className="text-slate-400 mb-8">El enlace de recuperación parece ser inválido o ha expirado.</p>
          <Link to="/" className="premium-btn px-8 py-3 rounded-2xl text-white font-bold inline-block">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl relative overflow-hidden"
        style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <span className="text-3xl text-blue-400">🆕</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Nueva Contraseña</h2>
          <p className="text-slate-400 text-sm">Crea una nueva clave de acceso para tu cuenta.</p>
        </div>

        {success ? (
          <div className="text-center py-6">
            <div className="text-blue-400 font-bold mb-4">¡Contraseña cambiada con éxito!</div>
            <p className="text-slate-500 text-sm">Serás redirigido al login en instantes...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-widest mb-2 ml-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-4 rounded-2xl text-white font-medium placeholder-slate-500 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-300/80 uppercase tracking-widest mb-2 ml-1">
                Repetir Contraseña
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-4 rounded-2xl text-white font-medium placeholder-slate-500 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
                placeholder="Repite tu nueva clave"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="premium-btn w-full text-white font-bold py-4 rounded-2xl tracking-wide disabled:opacity-50 transition-all shadow-[0_8px_30px_-4px_rgba(37,99,235,0.3)]"
            >
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
