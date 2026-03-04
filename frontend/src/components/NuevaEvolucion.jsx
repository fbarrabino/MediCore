import { useState } from 'react';
import { guardarEvolucion } from '../services/evolucionService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const NuevaEvolucion = ({ pacienteId, medicoId, onEvolucionGuardada }) => {
  const [motivo, setMotivo] = useState('');
  const [antecedentesActuales, setAntecedentesActuales] = useState('');
  const [antecedentesGenerales, setAntecedentesGenerales] = useState('');
  const [estudios, setEstudios] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivo.trim()) { toast.warn('Por favor complete al menos el Motivo de Consulta.'); return; }
    setLoading(true);
    try {
      const nuevaEvolucion = {
        pacienteId, medicoId, motivoConsulta: motivo,
        antecedentesEnfermedadActual: antecedentesActuales,
        antecedentesGenerales, estudiosComplementarios: estudios,
        diagnostico, indicaciones
      };
      await guardarEvolucion(nuevaEvolucion);
      onEvolucionGuardada();
      setMotivo(''); setAntecedentesActuales(''); setAntecedentesGenerales('');
      setEstudios(''); setDiagnostico(''); setIndicaciones('');
    } catch (error) {
      console.error(error); toast.error('Error al guardar la consulta.');
    } finally { setLoading(false); }
  };

  const textareaBase = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900/80 focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400 outline-none transition-all resize-y text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 italic";
  const labelBase = "block text-[10px] font-black uppercase tracking-widest mb-2";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      className="bg-white dark:bg-slate-800 rounded-3xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors"
    >
      {/* Header */}
      <div className="px-8 pt-7 pb-5 border-b border-slate-100 dark:border-slate-700/60"
        style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(99,102,241,0.06))' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(99,102,241,0.15))' }}>
            📋
          </div>
          <div>
            <h2 className="text-base font-black text-blue-900 dark:text-blue-300 uppercase tracking-tight leading-none">Nueva Consulta</h2>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Registrar evolución clínica</p>
          </div>
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5" autoComplete="off">
        {/* Motivo */}
        <div>
          <label className={`${labelBase} text-blue-600 dark:text-blue-400`}>Motivo de Consulta <span className="text-red-500 normal-case font-bold">*</span></label>
          <textarea
            value={motivo} onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Control de rutina, dolor abdominal..."
            className={`${textareaBase} min-h-[70px] border-blue-200 dark:border-blue-900/40`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={`${labelBase} text-slate-500 dark:text-slate-400`}>Enfermedad Actual</label>
            <textarea value={antecedentesActuales} onChange={(e) => setAntecedentesActuales(e.target.value)}
              className={`${textareaBase} min-h-[70px]`} placeholder="Descripción del cuadro actual..." />
          </div>
          <div>
            <label className={`${labelBase} text-slate-500 dark:text-slate-400`}>Antecedentes Generales</label>
            <textarea value={antecedentesGenerales} onChange={(e) => setAntecedentesGenerales(e.target.value)}
              className={`${textareaBase} min-h-[70px]`} placeholder="HTA, DBT, cirugías previas..." />
          </div>
        </div>

        <div>
          <label className={`${labelBase} text-slate-500 dark:text-slate-400`}>🔬 Estudios Complementarios</label>
          <textarea value={estudios} onChange={(e) => setEstudios(e.target.value)}
            className={`${textareaBase} min-h-[60px]`} placeholder="Labs, imágenes, resultados..." />
        </div>

        {/* Diagnosis – highlighted */}
        <div>
          <label className={`${labelBase} text-indigo-600 dark:text-indigo-400`}>🩺 Diagnóstico Presuntivo</label>
          <textarea value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)}
            className={`${textareaBase} min-h-[60px] border-indigo-200 dark:border-indigo-900/40 focus:ring-indigo-400/60 focus:border-indigo-400`}
            placeholder="Diagnóstico o hipótesis diagnóstica..." />
        </div>

        <div>
          <label className={`${labelBase} text-slate-500 dark:text-slate-400`}>💊 Indicaciones y Tratamiento</label>
          <textarea value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)}
            className={`${textareaBase} min-h-[80px]`} placeholder="Medicación, dosis, próximo control..." />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
          type="submit" disabled={loading}
          className="premium-btn w-full text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              Guardando...
            </span>
          ) : 'Guardar Consulta'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default NuevaEvolucion;