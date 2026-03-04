import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { guardarPaciente } from '../services/pacienteService';

const NuevoPacienteModal = ({ isOpen, onClose, onPacienteCreado, soloLectura = false, planActual = 'PRUEBA' }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    obraSocial: '',
    direccion: '',
    edad: '',
    telefono: '',
    emailPaciente: '',
    alergiasAlertas: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (soloLectura) {
      toast.warn('Tu plan ha expirado. Suscribite para continuar.');
      return;
    }
    if (!formData.nombre || !formData.dni) {
      toast.warn('El Nombre y el DNI son obligatorios.');
      return;
    }
    setLoading(true);
    try {
      const nuevoPaciente = {
        nombre: formData.nombre,
        dni: formData.dni,
        obraSocial: formData.obraSocial ? formData.obraSocial.toUpperCase() : '',
        edad: formData.edad,
        telefono: formData.telefono,
        emailPaciente: formData.emailPaciente || null,
        alergiasAlertas: formData.alergiasAlertas || null
      };
      const data = await guardarPaciente(nuevoPaciente);
      onPacienteCreado(data);
      toast.success('Paciente registrado con éxito');
      setFormData({ nombre: '', dni: '', obraSocial: '', direccion: '', edad: '', telefono: '', emailPaciente: '', alergiasAlertas: '' });
      onClose();
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.error || error?.message || '';
      if (msg.includes('LIMITE_ALCANZADO')) {
        toast.error('🚫 Límite de 200 pacientes alcanzado. Suscribite al Plan Premium para pacientes ilimitados.', { autoClose: 6000 });
      } else {
        toast.error('Hubo un error al registrar el paciente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/60 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="relative px-8 pt-7 pb-6 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #1e40af 100%)' }}>
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }} />
              <div className="relative flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-base"
                      style={{ background: 'rgba(255,255,255,0.15)' }}>
                      👤
                    </div>
                    <h2 className="text-white font-black text-xl tracking-tight">Registrar Paciente</h2>
                  </div>
                  <p className="text-blue-200/70 text-xs font-medium ml-10">Completa los datos del nuevo paciente</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Body - scrollable */}
            <form onSubmit={handleSubmit} id="nuevo-paciente-form" className="p-8 space-y-5 dark:bg-slate-900 flex-1 overflow-y-auto custom-scrollbar">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  name="nombre" required value={formData.nombre} onChange={handleChange}
                  autoComplete="off"
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium placeholder-slate-400"
                  placeholder=""
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* DNI */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    DNI <span className="text-red-500">*</span>
                  </label>
                    <input
                      name="dni" required value={formData.dni} onChange={handleChange}
                      autoComplete="off"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium placeholder-slate-400"
                      placeholder="Sin puntos"
                    />
                </div>
                {/* Edad */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Edad
                  </label>
                    <input
                      name="edad" value={formData.edad} onChange={handleChange}
                      autoComplete="off"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium placeholder-slate-400"
                      placeholder=""
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Teléfono */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Teléfono
                  </label>
                    <input
                      name="telefono" value={formData.telefono} onChange={handleChange}
                      autoComplete="off"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium placeholder-slate-400"
                      placeholder=""
                    />
                </div>
                {/* Obra Social */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Obra Social
                  </label>
                    <input
                      name="obraSocial" value={formData.obraSocial} onChange={handleChange}
                      autoComplete="off"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium placeholder-slate-400"
                      placeholder=""
                    />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Dirección
                </label>
                <input
                  name="direccion" value={formData.direccion} onChange={handleChange}
                  autoComplete="off"
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium placeholder-slate-400"
                  placeholder=""
                />
              </div>

              {/* Alergias / Alertas médicas */}
              <div>
                <label className="block text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-widest mb-2 ml-1">
                  ⚠ Alergias / Alertas Médicas
                  <span className="ml-2 normal-case font-medium text-slate-400">(opcional)</span>
                </label>
                <input
                  name="alergiasAlertas"
                  value={formData.alergiasAlertas}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full px-4 py-3.5 rounded-2xl border border-red-200/60 dark:border-red-800/30 bg-red-50/50 dark:bg-red-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-400/50 focus:border-red-400 outline-none transition-all font-medium placeholder-slate-400"
                  placeholder=""
                />
              </div>

              {/* ── SECCIÓN RECORDATORIO AUTOMÁTICO ── */}
              <div className="relative rounded-2xl overflow-hidden border border-blue-200/60 dark:border-blue-500/20">
                {/* Fondo con gradiente sutil */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(99,102,241,0.06) 100%)' }} />

                <div className="relative px-5 pt-4 pb-2">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}>
                      <span className="text-white text-sm">📧</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest leading-none">
                        Recordatorio Automático
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                        Se enviará un email 24 hs antes del turno
                        {planActual === 'BASICO' && (
                          <span className="ml-1 text-amber-500 font-bold">· Solo Premium ⭐</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative px-5 pb-5 pt-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Email del Paciente
                    <span className="ml-2 normal-case font-medium text-slate-400">(opcional)</span>
                  </label>
                  <input
                    name="emailPaciente"
                    type="email"
                    value={formData.emailPaciente}
                    onChange={handleChange}
                    autoComplete="off"
                    disabled={planActual === 'BASICO'}
                    className={`w-full px-4 py-3.5 rounded-2xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all font-medium placeholder-slate-400 ${
                      planActual === 'BASICO'
                        ? 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                        : 'border-blue-200 dark:border-blue-500/30'
                    }`}
                    placeholder=""
                  />
                  {planActual !== 'BASICO' && formData.emailPaciente && (
                    <div className="flex items-center gap-1.5 mt-2 ml-1">
                      <span className="text-emerald-500 text-xs">✓</span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        Recibirá recordatorio 24 hs antes del turno
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </form>

            {/* Sticky Footer - always visible */}
            <div className="px-8 py-5 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <button
                type="button" onClick={onClose}
                className="px-6 py-3 rounded-2xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancelar
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="submit" form="nuevo-paciente-form" disabled={loading}
                className="premium-btn px-8 py-3 rounded-2xl font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    Guardando...
                  </span>
                ) : 'Registrar Paciente'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NuevoPacienteModal;