import { useEffect, useState } from 'react';
import { obtenerHistorial, actualizarEvolucion, eliminarEvolucion } from '../services/evolucionService';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

/* Format a date string into "15 Mar 2026" */
const formatDate = (raw) => {
  if (!raw) return '';
  const d = new Date(raw);
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
};
const formatTime = (raw) => {
  if (!raw) return '';
  return new Date(raw).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const inputBase = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-400/60";
const textareaBase = `${inputBase} resize-y min-h-[60px]`;

const HistorialEvoluciones = ({ pacienteId, refreshTrigger }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const data = await obtenerHistorial(pacienteId);
        const sorted = data.sort((a, b) => new Date(b.fechaCarga || b.fecha) - new Date(a.fechaCarga || a.fecha));
        setHistorial(sorted);
      } catch (error) {
        console.error('Error cargando historial:', error);
      } finally { setLoading(false); }
    };
    if (pacienteId) fetchHistorial();
  }, [pacienteId, refreshTrigger]);

  const handleEditClick = (ev) => {
    setEditingId(ev.id);
    setEditForm({
      motivoConsulta: ev.motivoConsulta || ev.motivo || '',
      antecedentesEnfermedadActual: ev.antecedentesEnfermedadActual || '',
      antecedentesGenerales: ev.antecedentesGenerales || '',
      estudiosComplementarios: ev.estudiosComplementarios || '',
      diagnostico: ev.diagnostico || '',
      indicaciones: ev.indicaciones || ''
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await actualizarEvolucion(id, editForm);
      toast.success('Evolución modificada correctamente');
      setEditingId(null);
      setHistorial(historial.map(e => e.id === id ? { ...e, ...editForm } : e));
    } catch { toast.error('Error al modificar la evolución'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta consulta? Esta acción no se puede deshacer.')) {
      try {
        await eliminarEvolucion(id);
        toast.success('Consulta eliminada del historial');
        setHistorial(historial.filter(e => e.id !== id));
      } catch { toast.error('Error al eliminar la consulta'); }
    }
  };

  if (loading) return (
    <div className="text-center py-12 text-slate-500 font-medium">
      <div className="inline-block animate-pulse text-3xl mb-2">⟳</div>
      <p>Cargando historial...</p>
    </div>
  );

  if (historial.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-center py-14 text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 font-medium">
        <div className="text-4xl mb-3">📄</div>
        <p>No hay evoluciones registradas para este paciente.</p>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-2 space-y-1">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6 px-1">
        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Historial Clínico</h3>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-black text-white"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
          {historial.length}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative pl-10 timeline-line space-y-5">
        {historial.map((evolucion) => {
          const fechaRaw = evolucion.fechaCarga || evolucion.fecha;
          return (
            <motion.div
              key={evolucion.id}
              variants={itemVariants}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[2.55rem] top-5 w-4 h-4 rounded-full flex items-center justify-center z-10"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 0 0 3px white, 0 0 0 4px #6366f1' }}>
              </div>

              {/* Card */}
              <motion.div
                whileHover={editingId !== evolucion.id ? { y: -3 } : {}}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors group"
              >
                {/* Top micro-accent */}
                <div className="h-0.5" style={{ background: 'linear-gradient(90deg, #3b82f6, #6366f1, transparent)' }} />

                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {editingId === evolucion.id ? (
                      <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <h4 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-4">✏️ Editando Consulta</h4>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Motivo de Consulta</label>
                          <input type="text" value={editForm.motivoConsulta}
                            onChange={(e) => setEditForm({ ...editForm, motivoConsulta: e.target.value })} className={inputBase} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enfermedad Actual</label>
                            <textarea value={editForm.antecedentesEnfermedadActual}
                              onChange={(e) => setEditForm({ ...editForm, antecedentesEnfermedadActual: e.target.value })} className={textareaBase} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ant. Generales</label>
                            <textarea value={editForm.antecedentesGenerales}
                              onChange={(e) => setEditForm({ ...editForm, antecedentesGenerales: e.target.value })} className={textareaBase} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estudios Complementarios</label>
                          <input type="text" value={editForm.estudiosComplementarios}
                            onChange={(e) => setEditForm({ ...editForm, estudiosComplementarios: e.target.value })} className={inputBase} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnóstico</label>
                          <input type="text" value={editForm.diagnostico}
                            onChange={(e) => setEditForm({ ...editForm, diagnostico: e.target.value })} className={inputBase} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Indicaciones</label>
                          <textarea value={editForm.indicaciones}
                            onChange={(e) => setEditForm({ ...editForm, indicaciones: e.target.value })} className={textareaBase} />
                        </div>
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                          <button onClick={() => setEditingId(null)}
                            className="px-4 py-2 text-sm font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                            Cancelar
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                            onClick={() => handleSaveEdit(evolucion.id)}
                            className="px-5 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-all"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}>
                            Guardar Cambios
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {/* Header row: date + actions */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-black text-blue-600 dark:text-blue-400 tracking-widest uppercase">
                                {formatDate(fechaRaw)}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-400">
                                {formatTime(fechaRaw)}
                              </span>
                            </div>
                            <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight">
                              {evolucion.motivoConsulta || evolucion.motivo}
                            </h4>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(evolucion)} title="Editar"
                              className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all text-sm">
                              ✏️
                            </button>
                            <button onClick={() => handleDelete(evolucion.id)} title="Eliminar"
                              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-all text-sm">
                              🗑️
                            </button>
                          </div>
                        </div>

                        {/* Fields */}
                        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                          {evolucion.antecedentesEnfermedadActual && (
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Enfermedad Actual</span>
                              <p>{evolucion.antecedentesEnfermedadActual}</p>
                            </div>
                          )}
                          {evolucion.antecedentesGenerales && (
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Antecedentes Generales</span>
                              <p>{evolucion.antecedentesGenerales}</p>
                            </div>
                          )}
                          {evolucion.estudiosComplementarios && (
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">🔬 Estudios</span>
                              <p>{evolucion.estudiosComplementarios}</p>
                            </div>
                          )}
                          {evolucion.diagnostico && (
                            <div className="mt-4 px-4 py-3 rounded-xl border-l-4 border-indigo-500"
                              style={{ background: 'rgba(99,102,241,0.07)' }}>
                              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">🩺 Diagnóstico</span>
                              <p className="text-slate-800 dark:text-slate-200 font-semibold">{evolucion.diagnostico}</p>
                            </div>
                          )}
                          {evolucion.indicaciones && (
                            <div className="mt-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">💊 Indicaciones</span>
                              <p>{evolucion.indicaciones}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HistorialEvoluciones;