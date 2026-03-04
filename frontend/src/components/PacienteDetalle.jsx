import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { obtenerPacientePorId, actualizarPaciente } from '../services/pacienteService';
import { obtenerHistorial, guardarEvolucion, actualizarEvolucion, eliminarEvolucion } from '../services/evolucionService';
import { imprimirHistoriaClinica } from './ExportarPDF';
import ConfirmModal from './ConfirmModal';
import PacienteEstudios from './PacienteEstudios';

/* Input component for edit mode */
const EditInput = ({ value, onChange, placeholder = '' }) => (
  <input type="text" autoComplete="nope" value={value} onChange={onChange} placeholder={placeholder}
    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-400/60 outline-none transition-all text-sm font-medium shadow-sm" />
);

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0v-2.94a2.25 2.25 0 012.25-2.25h6a2.25 2.25 0 012.25 2.25v2.94z" />
  </svg>
);

export default function PacienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isDarkMode, cardBg } = useOutletContext();
  
  const [paciente, setPaciente] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({
    motivoConsulta: '', enfermedadActual: '', antecedentes: '', estudiosComplementarios: '', diagnostico: '', indicaciones: ''
  });
  const [isSaving, setIsSaving] = useState(false);
    
  // Modal de confirmación para eliminar
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

  const scrollRef = useRef(null);

  // Edit Patient State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nombre: '', dni: '', obraSocial: '', edad: '', telefono: '', direccionBarrio: '', contactoFamiliar: '', alergiasAlertas: '', emailPaciente: ''
  });

  // Edit Timeline State
  const [editingId, setEditingId] = useState(null);
  const [editFormTimeline, setEditFormTimeline] = useState({});

  // Tabs State
  const [activeTab, setActiveTab] = useState('historia'); // 'historia' | 'estudios'

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pacData, histData] = await Promise.all([
          obtenerPacientePorId(id),
          obtenerHistorial(id)
        ]);
        setPaciente(pacData);
        setEditData({
          nombre: pacData.nombre || '', dni: pacData.dni || '', obraSocial: pacData.obraSocial || '', 
          edad: pacData.edad || '', telefono: pacData.telefono || '',
          direccionBarrio: pacData.direccionBarrio || '', contactoFamiliar: pacData.contactoFamiliar || '',
          alergiasAlertas: pacData.alergiasAlertas || '', emailPaciente: pacData.emailPaciente || ''
        });
        setHistorial(histData.sort((a,b) => new Date(b.fechaCarga) - new Date(a.fechaCarga)));
      } catch (err) {
        toast.error('Error al cargar la ficha del paciente');
        navigate('/panel/pacientes');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.motivoConsulta || !form.diagnostico) return toast.warning('Completar campos obligatorios');
    setIsSaving(true);
    try {
      const evolucionData = {
        motivoConsulta: form.motivoConsulta,
        antecedentesEnfermedadActual: form.enfermedadActual,
        antecedentesGenerales: form.antecedentes,
        estudiosComplementarios: form.estudiosComplementarios,
        diagnostico: form.diagnostico,
        indicaciones: form.indicaciones,
        pacienteId: paciente.id,
        medicoId: user.id
      };
      const response = await guardarEvolucion(evolucionData);
      // El backend devuelve { mensaje: "...", evolucion: { ... } }
      const nuevaEvolucion = response.evolucion || response;
      
      const arr = [nuevaEvolucion, ...historial].sort((a,b) => {
        const dateA = a.fechaCarga ? new Date(a.fechaCarga) : new Date();
        const dateB = b.fechaCarga ? new Date(b.fechaCarga) : new Date();
        return dateB - dateA;
      });
      setHistorial(arr);
      setForm({ motivoConsulta: '', enfermedadActual: '', antecedentes: '', estudiosComplementarios: '', diagnostico: '', indicaciones: '' });
      toast.success('Evolución guardada con éxito');
    } catch {
      toast.error('Error al guardar la evolución');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePatient = async () => {
    if (!editData.nombre.trim()) return toast.warning('El nombre del paciente no puede estar vacío');
    try {
      const pacienteActualizado = { ...paciente, ...editData };
      const data = await actualizarPaciente(paciente.id, pacienteActualizado);
      setPaciente(data);
      setIsEditing(false);
      toast.success('Datos del paciente actualizados');
    } catch {
      toast.error('Error al actualizar los datos');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      nombre: paciente.nombre || '', dni: paciente.dni || '', obraSocial: paciente.obraSocial || '', 
      edad: paciente.edad || '', telefono: paciente.telefono || '',
      direccionBarrio: paciente.direccionBarrio || '', contactoFamiliar: paciente.contactoFamiliar || '',
      alergiasAlertas: paciente.alergiasAlertas || '', emailPaciente: paciente.emailPaciente || ''
    });
  };

  const handleEditClick = (ev) => {
    setEditingId(ev.id);
    setEditFormTimeline({
      motivoConsulta: ev.motivoConsulta || '',
      antecedentesEnfermedadActual: ev.antecedentesEnfermedadActual || '',
      antecedentesGenerales: ev.antecedentesGenerales || '',
      estudiosComplementarios: ev.estudiosComplementarios || '',
      diagnostico: ev.diagnostico || '',
      indicaciones: ev.indicaciones || ''
    });
  };

  const handleSaveEditEvolucion = async (id) => {
    try {
      await actualizarEvolucion(id, editFormTimeline);
      toast.success('Evolución modificada correctamente');
      setEditingId(null);
      setHistorial(historial.map(e => e.id === id ? { ...e, ...editFormTimeline } : e));
    } catch { toast.error('Error al modificar la evolución'); }
  };

  const handleDeleteEvolucion = async (id) => {
    if (!id) {
        toast.error('Error: ID de evolución no encontrado.');
        return;
    }
    try {
      await eliminarEvolucion(id);
      setHistorial(historial.filter(e => e.id !== id));
      toast.success('Consulta eliminada correctamente');
    } catch (err) {
      toast.error('Error al eliminar la consulta');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Cargando Historia Clínica...</div>;
  if (!paciente) return <div className="p-8 text-center text-red-500 font-bold">Paciente no encontrado. O no posee los permisos adecuados.</div>;

  const inputClass = `w-full p-3 rounded-xl border focus:ring-2 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 focus:ring-blue-500/50 text-white' : 'bg-white border-slate-300 focus:ring-blue-500/30'}`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header Glassmorphism */}
      <div className={`p-6 rounded-3xl border shadow-sm backdrop-blur-md transition-colors ${isDarkMode ? 'bg-slate-800/70 border-slate-700' : 'bg-white/90 border-slate-200'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div className="flex gap-4 items-center w-full">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-inner shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
              {paciente.nombre.charAt(0)}
            </div>
            <div className="flex-1 w-full">
              {isEditing ? (
                <input type="text" value={editData.nombre} onChange={(e) => setEditData({...editData, nombre: e.target.value})} autoComplete="off" className={`w-full text-2xl md:text-3xl font-black bg-transparent border-b-2 p-1 outline-none ${isDarkMode ? 'text-white border-blue-500/50 focus:border-blue-400' : 'text-slate-800 border-blue-500/50 focus:border-blue-600'}`} placeholder="" />
              ) : (
                <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{paciente.nombre} {paciente.apellido}</h2>
              )}
              {isEditing ? (
                <div className="flex items-center gap-2 mt-1">
                  <p className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>DNI:</p>
                  <input type="text" value={editData.dni} onChange={(e) => setEditData({...editData, dni: e.target.value})} autoComplete="off" className={`text-xs font-black bg-transparent border-b-2 outline-none p-1 w-32 ${isDarkMode ? 'text-white border-blue-500/50 focus:border-blue-400' : 'text-slate-800 border-blue-500/50 focus:border-blue-600'}`} placeholder="" />
                </div>
              ) : (
                <p className={`text-xs font-black uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>DNI: {paciente.dni}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={() => imprimirHistoriaClinica(paciente)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold border transition-colors shadow-sm text-sm ${isDarkMode ? 'bg-slate-800 text-blue-400 border-slate-700 hover:border-blue-500 hover:bg-slate-700' : 'bg-white text-blue-700 border-blue-100 hover:bg-blue-50 hover:border-blue-300'}`}>
              <PrintIcon /> Imprimir HC
            </button>
            <button onClick={() => navigate('/panel/pacientes')} className={`px-4 py-2.5 rounded-xl font-bold border-2 transition-colors ${isDarkMode ? 'text-slate-300 border-slate-600 hover:bg-slate-700' : 'text-slate-500 border-slate-200 hover:bg-slate-50'}`}>← Volver</button>
          </div>
        </div>

        {/* Alertas */}
        <div className="mb-6">
          {isEditing ? (
            <div className="mt-4">
              <label className="block text-xs font-black text-red-500 uppercase tracking-widest mb-2">⚠ Alergias / Alertas Médicas</label>
              <input type="text" value={editData.alergiasAlertas} onChange={(e) => setEditData({...editData, alergiasAlertas: e.target.value})} autoComplete="off" className="w-full p-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 focus:ring-2 focus:ring-red-400 outline-none text-red-700 dark:text-red-300 transition-all font-medium" placeholder=""/>
            </div>
          ) : (
            paciente.alergiasAlertas && (
               <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                 <span className="text-lg mt-0.5">⚠️</span>
                 <div>
                   <p className="text-[10px] font-black text-red-800 dark:text-red-400 uppercase tracking-wider mb-0.5">Alerta Médica</p>
                   <p className="text-red-700 dark:text-red-300 font-semibold text-sm">{paciente.alergiasAlertas}</p>
                 </div>
               </div>
            )
          )}
        </div>

        {/* Info Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Obra Social</p>
            {isEditing ? <EditInput value={editData.obraSocial} onChange={(e) => setEditData({...editData, obraSocial: e.target.value})} placeholder="" />
                       : paciente.obraSocial
                           ? <span className={`inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${isDarkMode ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>{paciente.obraSocial.toUpperCase()}</span>
                           : <span className="text-slate-400">—</span>}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dirección</p>
            {isEditing ? <EditInput value={editData.direccionBarrio} onChange={(e) => setEditData({...editData, direccionBarrio: e.target.value})} placeholder="" />
                       : <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{paciente.direccionBarrio || <span className="text-slate-400">—</span>}</p>}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Edad</p>
            {isEditing ? <EditInput value={editData.edad} onChange={(e) => setEditData({...editData, edad: e.target.value})} placeholder="" />
                       : <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{paciente.edad || <span className="text-slate-400">—</span>}</p>}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Teléfono</p>
            {isEditing ? <EditInput value={editData.telefono} onChange={(e) => setEditData({...editData, telefono: e.target.value})} placeholder="" />
                       : <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{paciente.telefono || <span className="text-slate-400">—</span>}</p>}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contacto Familiar</p>
            {isEditing ? <EditInput value={editData.contactoFamiliar} onChange={(e) => setEditData({...editData, contactoFamiliar: e.target.value})} placeholder="" />
                       : <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{paciente.contactoFamiliar || <span className="text-slate-400">—</span>}</p>}
          </div>
          <div className="md:col-span-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email (Recordatorios)</p>
            {isEditing ? <EditInput value={editData.emailPaciente} onChange={(e) => setEditData({...editData, emailPaciente: e.target.value})} placeholder="paciente@email.com" />
                       : <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{paciente.emailPaciente || <span className="text-slate-400">—</span>}</p>}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-5 flex justify-end gap-3">
            {isEditing ? (
              <>
                <button onClick={handleCancelEdit} className={`px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'}`}>Cancelar</button>
                <button onClick={handleSavePatient} className="px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-blue-900/20" style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}>Guardar Cambios</button>
              </>
            ) : (
                <button onClick={() => setIsEditing(true)} className={`px-6 py-2.5 rounded-xl font-bold text-sm border transition-all ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}>✎ Modificar Datos</button>
            )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-4 p-1.5 rounded-2xl bg-slate-200/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 w-fit mx-auto md:mx-0">
          <button 
            type="button"
            onClick={() => setActiveTab('historia')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'historia' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            📋 Historia Clínica
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('estudios')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'estudios' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            🖼️ Estudios e Imágenes
          </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'historia' ? (
          <motion.div 
            key="historia"
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 10 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Columna Izquierda: Nueva Evolución Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} delay={0.1} className={`p-6 rounded-3xl border shadow-sm ${cardBg}`}>
              <h3 className={`text-xl font-black mb-5 tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <span className="text-blue-500 text-2xl">✎</span> Nueva Evolución
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Motivo de Consulta (*)</label>
                  <textarea value={form.motivoConsulta} onChange={(e) => setForm({...form, motivoConsulta: e.target.value})} autoComplete="off" className={inputClass} rows="2" placeholder="" required />
                </div>
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Enfermedad Actual</label>
                  <textarea value={form.enfermedadActual} onChange={(e) => setForm({...form, enfermedadActual: e.target.value})} autoComplete="off" className={inputClass} rows="2" placeholder=""/>
                </div>
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Antecedentes Generales</label>
                  <textarea value={form.antecedentes} onChange={(e) => setForm({...form, antecedentes: e.target.value})} autoComplete="off" className={inputClass} rows="2" placeholder=""/>
                </div>
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Estudios Complementarios</label>
                  <textarea value={form.estudiosComplementarios} onChange={(e) => setForm({...form, estudiosComplementarios: e.target.value})} autoComplete="off" className={inputClass} rows="2" placeholder=""/>
                </div>
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Diagnóstico Presuntivo (*)</label>
                  <input type="text" value={form.diagnostico} onChange={(e) => setForm({...form, diagnostico: e.target.value})} autoComplete="off" className={`w-full p-3 rounded-xl text-lg font-bold border focus:ring-2 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 focus:ring-indigo-500/50 text-white' : 'bg-white border-slate-300 focus:ring-indigo-500/30 text-indigo-900'}`} placeholder="" required />
                </div>
                <div>
                  <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Indicaciones y Tratamiento</label>
                  <textarea value={form.indicaciones} onChange={(e) => setForm({...form, indicaciones: e.target.value})} autoComplete="off" className={inputClass} rows="2" placeholder=""/>
                </div>

                <div className={`text-[10px] font-bold italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-4`}>
                  * Los campos marcados con asterisco son obligatorios. El resto de la información es opcional.
                </div>
                
                <button type="submit" disabled={isSaving} className="w-full mt-2 py-4 rounded-xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg disabled:opacity-50">
                  {isSaving ? 'Guardando...' : 'Firmar y Guardar Evolución'}
                </button>
              </form>
            </motion.div>

            {/* Columna Derecha: Timeline Historial */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} delay={0.2} className={`p-6 rounded-3xl border shadow-sm ${cardBg} max-h-[900px] overflow-y-auto custom-scrollbar`}>
              <h3 className={`text-xl font-black mb-8 tracking-tight sticky top-0 bg-inherit py-2 z-10 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <span className="text-emerald-500 text-2xl mr-2">⏱</span> Historial Clínico
              </h3>
              
              <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-700 ml-4">
                {historial.length === 0 ? (
                  <p className="pl-6 text-slate-500 font-medium italic">No hay evoluciones registradas para este paciente.</p>
                ) : historial.map((evo) => (
                  <div key={evo.id} className="relative pl-8 group">
                    <div className="absolute w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full -left-[11px] top-1 border-4 border-white dark:border-slate-800 shadow-sm" />
                    
                    <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-slate-50 border-slate-200 hover:bg-white'} hover:shadow-md`}>
                      <AnimatePresence mode="wait">
                        {editingId === evo.id ? (
                          <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                            <h4 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-4">✏️ Editando Consulta</h4>
                            <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Motivo</label><input type="text" value={editFormTimeline.motivoConsulta} onChange={(e) => setEditFormTimeline({ ...editFormTimeline, motivoConsulta: e.target.value })} className={inputClass} /></div>
                            <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Enfermedad Actual</label><textarea value={editFormTimeline.antecedentesEnfermedadActual} onChange={(e) => setEditFormTimeline({ ...editFormTimeline, antecedentesEnfermedadActual: e.target.value })} className={inputClass} rows="2"/></div>
                            <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Ant. Generales</label><textarea value={editFormTimeline.antecedentesGenerales} onChange={(e) => setEditFormTimeline({ ...editFormTimeline, antecedentesGenerales: e.target.value })} className={inputClass} rows="2"/></div>
                            <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Estudios Complementarios</label><textarea value={editFormTimeline.estudiosComplementarios} onChange={(e) => setEditFormTimeline({ ...editFormTimeline, estudiosComplementarios: e.target.value })} className={inputClass} rows="2"/></div>
                            <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Diagnóstico</label><input type="text" value={editFormTimeline.diagnostico} onChange={(e) => setEditFormTimeline({ ...editFormTimeline, diagnostico: e.target.value })} className={inputClass} /></div>
                            <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Indicaciones</label><textarea value={editFormTimeline.indicaciones} onChange={(e) => setEditFormTimeline({ ...editFormTimeline, indicaciones: e.target.value })} className={inputClass} rows="2"/></div>
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                              <button onClick={() => setEditingId(null)} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>Cancelar</button>
                              <button onClick={() => handleSaveEditEvolucion(evo.id)} className="px-5 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-all" style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}>Guardar Cambios</button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="flex justify-between items-start mb-3">
                              <div className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                <p>
                                 {(() => {
                                   try {
                                     const d = new Date(evo.fechaCarga);
                                     return isNaN(d.getTime()) ? 'Fecha pendiente' : d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });
                                   } catch { return 'Fecha pendiente'; }
                                 })()}
                               </p>
                             </div>
                             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               {/* Botón Editar */}
                               <button onClick={() => handleEditClick(evo)} title="Editar" className="p-1.5 rounded-md text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all">✏️</button>
                               {/* Botón Eliminar */}
                               <button 
                                 onClick={() => setConfirmDelete({ isOpen: true, id: evo.id })} 
                                 title="Eliminar" 
                                 className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-all font-bold"
                               >
                                 🗑️
                               </button>
                                 <span className="text-xs font-bold text-slate-400 mt-1 ml-2">Dr. {user.nombre}</span>
                              </div>
                            </div>
                            
                            <h4 className={`text-lg font-black mb-2 flex items-center gap-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                              {evo.diagnostico}
                            </h4>
                            <div className={`space-y-2 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              <p><strong className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Motivo:</strong> {evo.motivoConsulta}</p>
                              {evo.antecedentesEnfermedadActual && <p><strong className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Enfermedad:</strong> {evo.antecedentesEnfermedadActual}</p>}
                              {evo.antecedentesGenerales && <p><strong className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Ant. Generales:</strong> {evo.antecedentesGenerales}</p>}
                              {evo.estudiosComplementarios && <p><strong className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Estudios:</strong> {evo.estudiosComplementarios}</p>}
                              {evo.indicaciones && <p><strong className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Indicaciones:</strong> {evo.indicaciones}</p>}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="estudios"
            initial={{ opacity: 0, x: 10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -10 }}
          >
            <PacienteEstudios pacienteId={id} isDarkMode={isDarkMode} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Confirmación para eliminar */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={() => handleDeleteEvolucion(confirmDelete.id)}
        title="¿Eliminar Evolución?"
        message="Esta acción no se puede deshacer. Se borrará permanentemente de la historia clínica del paciente."
        confirmText="Sí, eliminar"
        type="danger"
      />
    </motion.div>
  );
}
