import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { actualizarPaciente, eliminarPaciente } from '../services/pacienteService';
import { motion, AnimatePresence } from 'framer-motion';

/* ---- Icon helpers ---- */
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

/* Derive initials from patient name */
const getPatientInitials = (name = '') => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.charAt(0).toUpperCase();
};

/* Obra social badge color */
const getObraSocialColor = (obra) => {
  if (!obra || obra.toLowerCase() === 'particular') return { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)', text: '#64748b' };
  const l = obra.toLowerCase();
  if (l.includes('osde')) return { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', text: '#059669' };
  if (l.includes('ioma') || l.includes('pami')) return { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)', text: '#6366f1' };
  return { bg: 'rgba(37,99,235,0.12)', border: 'rgba(37,99,235,0.3)', text: '#2563eb' };
};

/* Field component for view mode */
const InfoField = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">{value || <span className="text-slate-400">—</span>}</p>
  </div>
);

/* Input component for edit mode */
const EditInput = ({ value, onChange, placeholder = '' }) => (
  <input
    type="text"
    autoComplete="nope"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-400/60 outline-none transition-all text-sm font-medium shadow-sm"
  />
);

const PacienteCard = ({ paciente, onPacienteActualizado, onPacienteEliminado }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getDirYBarrio = (dirCompleta) => {
    if (!dirCompleta) return { dir: '', bar: '' };
    const partes = dirCompleta.split(' - ');
    return { dir: partes[0] || '', bar: partes[1] || '' };
  };
  const { dir: dirActual, bar: barActual } = getDirYBarrio(paciente.direccionBarrio);

  const [editData, setEditData] = useState({
    nombre: paciente.nombre || '', dni: paciente.dni || '', obraSocial: paciente.obraSocial || '', edad: paciente.edad || '', telefono: paciente.telefono || '',
    barrio: barActual, contactoFamiliar: paciente.contactoFamiliar || '',
    direccion: dirActual, alergiasAlertas: paciente.alergiasAlertas || ''
  });

  useEffect(() => {
    const { dir, bar } = getDirYBarrio(paciente.direccionBarrio);
    setEditData({
      nombre: paciente.nombre || '', dni: paciente.dni || '', obraSocial: paciente.obraSocial || '', edad: paciente.edad || '', telefono: paciente.telefono || '',
      barrio: bar, contactoFamiliar: paciente.contactoFamiliar || '',
      direccion: dir, alergiasAlertas: paciente.alergiasAlertas || ''
    });
  }, [paciente]);

  const handleSave = async () => {
    if (!editData.nombre.trim()) { toast.warn('El nombre del paciente no puede estar vacío'); return; }
    try {
      const pacienteActualizado = {
        ...paciente, nombre: editData.nombre, dni: editData.dni, obraSocial: editData.obraSocial, edad: editData.edad, telefono: editData.telefono,
        contactoFamiliar: editData.contactoFamiliar, alergiasAlertas: editData.alergiasAlertas,
        direccionBarrio: editData.direccion || editData.barrio ? `${editData.direccion} - ${editData.barrio}` : null
      };
      const data = await actualizarPaciente(paciente.id, pacienteActualizado);
      onPacienteActualizado(data);
      setIsEditing(false);
      toast.success('Datos del paciente actualizados');
    } catch (error) {
      console.error(error); toast.error('Error al actualizar los datos');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    const { dir, bar } = getDirYBarrio(paciente.direccionBarrio);
    setEditData({
      nombre: paciente.nombre || '', dni: paciente.dni || '', obraSocial: paciente.obraSocial || '', edad: paciente.edad || '', telefono: paciente.telefono || '',
      barrio: bar, contactoFamiliar: paciente.contactoFamiliar || '',
      direccion: dir, alergiasAlertas: paciente.alergiasAlertas || ''
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await eliminarPaciente(paciente.id);
      toast.success(`Paciente "${paciente.nombre}" eliminado correctamente`);
      setShowDeleteConfirm(false);
      if (onPacienteEliminado) onPacienteEliminado();
    } catch (error) {
      console.error(error); toast.error('Error al eliminar el paciente');
    } finally { setDeleting(false); }
  };

  const obraColors = getObraSocialColor(paciente.obraSocial);
  const initials = getPatientInitials(paciente.nombre);

  return (
    <>
      {/* ---- Delete confirm modal ---- */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-red-100 dark:border-red-900/30"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrashIcon />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">¿Eliminar paciente?</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Estás por eliminar a <strong className="text-slate-700 dark:text-slate-200">{paciente.nombre}</strong> y todo su historial. Esta acción <strong className="text-red-600">no se puede deshacer</strong>.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                  Cancelar
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 disabled:opacity-60 active:scale-95">
                  {deleting ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Patient Card ---- */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={!isEditing ? { y: -4 } : {}}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors"
      >
        {/* Top gradient accent */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)' }} />

        <div className="p-8">
          {/* Patient header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div className="flex items-center gap-4 w-full">
              {/* Patient avatar */}
              <div className="w-14 h-14 rounded-2xl text-white text-lg font-black flex items-center justify-center shrink-0 shadow-md"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                {initials}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text" value={editData.nombre}
                    onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                    className="w-full text-2xl md:text-3xl font-black text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Nombre del paciente"
                  />
                ) : (
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">{paciente.nombre}</h2>
                )}
                {isEditing ? (
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">DNI:</p>
                    <input type="text" value={editData.dni} onChange={(e) => setEditData({...editData, dni: e.target.value})} className="text-xs font-black text-slate-800 dark:text-white bg-transparent border-b-2 border-slate-300 dark:border-slate-600 outline-none p-1 focus:border-blue-400 transition-all w-32" placeholder="DNI" />
                  </div>
                ) : (
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">DNI: {paciente.dni}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Obra social badge */}
              {isEditing ? (
                <input
                  type="text" value={editData.obraSocial}
                  onChange={(e) => setEditData({ ...editData, obraSocial: e.target.value })}
                  className="w-36 text-center px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 outline-none focus:ring-2 focus:ring-blue-400 text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200"
                  placeholder="Particular"
                />
              ) : (
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                  style={{ background: obraColors.bg, border: `1px solid ${obraColors.border}`, color: obraColors.text }}>
                  {paciente.obraSocial || 'Particular'}
                </span>
              )}

              {/* Delete button */}
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDeleteConfirm(true)} title="Eliminar paciente"
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-900/40 transition-all"
                >
                  <TrashIcon />
                </motion.button>
              )}
            </div>
          </div>

          {/* Allergies banner */}
          <div className="mb-6">
            {isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <label className="block text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-2">⚠ Alergias / Alertas Médicas</label>
                <input
                  type="text" autoComplete="nope"
                  placeholder="Ej: Alérgico a la penicilina..."
                  value={editData.alergiasAlertas}
                  onChange={(e) => setEditData({ ...editData, alergiasAlertas: e.target.value })}
                  className="w-full p-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 focus:ring-2 focus:ring-red-400 outline-none text-red-700 dark:text-red-300 transition-all font-medium"
                />
              </motion.div>
            ) : (
              paciente.alergiasAlertas && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                  <span className="text-lg mt-0.5">⚠️</span>
                  <div>
                    <p className="text-[10px] font-black text-red-800 dark:text-red-400 uppercase tracking-wider mb-0.5">Alerta Médica</p>
                    <p className="text-red-700 dark:text-red-300 font-semibold text-sm">{paciente.alergiasAlertas}</p>
                  </div>
                </motion.div>
              )
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/50">
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Dirección</p>
              {isEditing
                ? <EditInput value={editData.direccion} onChange={(e) => setEditData({ ...editData, direccion: e.target.value })} placeholder="Calle 123" />
                : <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">{dirActual || <span className="text-slate-400">—</span>}</p>}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Barrio</p>
              {isEditing
                ? <EditInput value={editData.barrio} onChange={(e) => setEditData({ ...editData, barrio: e.target.value })} placeholder="Localidad" />
                : <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">{barActual || <span className="text-slate-400">—</span>}</p>}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Edad</p>
              {isEditing
                ? <EditInput value={editData.edad} onChange={(e) => setEditData({ ...editData, edad: e.target.value })} placeholder="Ej: 45 años" />
                : <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">{paciente.edad || <span className="text-slate-400">—</span>}</p>}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Teléfono</p>
              {isEditing
                ? <EditInput value={editData.telefono} onChange={(e) => setEditData({ ...editData, telefono: e.target.value })} placeholder="Ej: 1122334455" />
                : <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">{paciente.telefono || <span className="text-slate-400">—</span>}</p>}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Contacto Familiar</p>
              {isEditing
                ? <EditInput value={editData.contactoFamiliar} onChange={(e) => setEditData({ ...editData, contactoFamiliar: e.target.value })} placeholder="Nombre / tel." />
                : <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">{paciente.contactoFamiliar || <span className="text-slate-400">—</span>}</p>}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex justify-end gap-3">
            {isEditing && (
              <button onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all">
                Cancelar
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isEditing
                  ? 'text-white shadow-lg shadow-blue-900/20'
                  : 'bg-white dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm'
              }`}
              style={isEditing ? { background: 'linear-gradient(135deg, #2563eb, #6366f1)' } : {}}
            >
              {!isEditing && <PencilIcon />}
              {isEditing ? 'Guardar Cambios' : 'Modificar Datos'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PacienteCard;