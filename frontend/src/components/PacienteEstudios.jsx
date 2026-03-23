import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { obtenerEstudiosPorPaciente, guardarEstudio, eliminarEstudio } from '../services/estudioService';

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
  </svg>
);

export default function PacienteEstudios({ pacienteId, isDarkMode }) {
    const [estudios, setEstudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    
    const [saving, setSaving] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    
    const [newEstudio, setNewEstudio] = useState({
        tipo: 'Resonancia',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        archivoUrl: ''
    });

    useEffect(() => {
        loadEstudios();
    }, [pacienteId]);

    const loadEstudios = async () => {
        try {
            const data = await obtenerEstudiosPorPaciente(pacienteId);
            setEstudios(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error('Error al cargar estudios');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Límite de 5MB (5 * 1024 * 1024 bytes)
            if (file.size > 5 * 1024 * 1024) {
                toast.warning('La imagen es demasiado pesada (máximo 5MB).');
                e.target.value = ''; // Limpiar input
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setNewEstudio({ ...newEstudio, archivoUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newEstudio.archivoUrl) return toast.warning('Debes subir un archivo');
        if (saving) return;

        setSaving(true);
        try {
            const data = await guardarEstudio({ ...newEstudio, pacienteId });
            const study = data.estudio || data; 
            setEstudios([study, ...estudios]);
            setShowUpload(false);
            setNewEstudio({ tipo: 'Resonancia', descripcion: '', fecha: new Date().toISOString().split('T')[0], archivoUrl: '' });
            toast.success('Estudio guardado');
        } catch (err) {
            toast.error('Error al guardar estudio');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await eliminarEstudio(id);
            setEstudios(estudios.filter(e => e.id !== id));
            toast.success('Estudio eliminado');
            setConfirmDeleteId(null);
        } catch (err) {
            toast.error('Error al eliminar');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Cargando estudios...</div>;

    const tipos = ['Resonancia', 'Radiografía', 'Ecografía', 'Tomografía', 'Laboratorio', 'Foto Clínica', 'Otro'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Estudios e Imágenes</h3>
                <button 
                    onClick={() => setShowUpload(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                >
                    + Nuevo Estudio
                </button>
            </div>

            {!Array.isArray(estudios) || estudios.length === 0 ? (
                <div className={`p-12 text-center rounded-3xl border-2 border-dashed ${isDarkMode ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="text-4xl mb-3 opacity-30">📁</div>
                    <p className="text-slate-500 font-bold italic">No hay estudios multimedia registrados.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {estudios.map(est => (
                        <motion.div 
                            key={est.id} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-4 rounded-3xl border overflow-hidden group relative transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}
                        >
                            <div 
                                className="aspect-video w-full rounded-2xl bg-slate-900 overflow-hidden mb-4 cursor-pointer relative flex items-center justify-center"
                                onClick={() => setSelectedImage(est.archivoUrl)}
                            >
                                {est.archivoUrl?.startsWith('data:image') || est.archivoUrl?.startsWith('http') ? (
                                    <img src={est.archivoUrl} alt={est.tipo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="text-blue-500"><FileIcon /></div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 text-white font-black text-xs uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-xl backdrop-blur-sm transition-opacity">Ver en grande</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>{est.tipo}</span>
                                    <h4 className={`text-sm font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{new Date(est.fecha).toLocaleDateString()}</h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{est.descripcion || 'Sin descripción'}</p>
                                </div>
                                <button 
                                    onClick={() => setConfirmDeleteId(est.id)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-all"
                                >
                                    <TrashIcon />
                                </button>
                            </div>

                            {/* Custom Confirmation Overlay */}
                            <AnimatePresence>
                                {confirmDeleteId === est.id && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-center"
                                    >
                                        <p className="text-white font-black text-sm mb-4">¿Eliminar este estudio?</p>
                                        <div className="flex gap-2 w-full">
                                            <button 
                                                onClick={() => setConfirmDeleteId(null)}
                                                className="flex-1 py-2 rounded-xl bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 transition-all"
                                            >
                                                No, volver
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(est.id)}
                                                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-all"
                                            >
                                                Sí, borrar
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal de Carga */}
            <AnimatePresence>
                {showUpload && (
                    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className={`w-full max-w-lg p-8 rounded-3xl border shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                        >
                            <h3 className="text-2xl font-black mb-6">Nuevo Estudio o Imagen</h3>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Tipo de Estudio</label>
                                    <select 
                                        value={newEstudio.tipo} 
                                        onChange={(e) => setNewEstudio({ ...newEstudio, tipo: e.target.value })}
                                        className={`w-full p-3 rounded-xl border font-bold outline-none ring-blue-500/20 focus:ring-4 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                    >
                                        {tipos.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Fecha</label>
                                    <input 
                                        type="date" 
                                        value={newEstudio.fecha}
                                        onChange={(e) => setNewEstudio({ ...newEstudio, fecha: e.target.value })}
                                        className={`w-full p-3 rounded-xl border font-bold outline-none ring-blue-500/20 focus:ring-4 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Descripción / Notas</label>
                                    <textarea 
                                        value={newEstudio.descripcion}
                                        onChange={(e) => setNewEstudio({ ...newEstudio, descripcion: e.target.value })}
                                        rows="2"
                                        className={`w-full p-3 rounded-xl border font-bold outline-none ring-blue-500/20 focus:ring-4 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                        placeholder="Ej: Resonancia magnética lumbar L4-L5..."
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Archivo / Imagen</label>
                                        <span className={`text-[9px] font-black uppercase tracking-wider ${isDarkMode ? 'text-blue-400/60' : 'text-blue-500/60'}`}>Límite: 5MB</span>
                                    </div>
                                    <div 
                                        className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${newEstudio.archivoUrl ? 'border-emerald-500 bg-emerald-500/5' : (isDarkMode ? 'border-slate-800 hover:border-blue-500' : 'border-slate-200 hover:border-blue-500')}`}
                                        onClick={() => document.getElementById('estudioFile').click()}
                                    >
                                        {newEstudio.archivoUrl ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                                                    <img src={newEstudio.archivoUrl} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-emerald-500 text-[10px] font-black uppercase">Archivo cargado ✓</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-slate-500">
                                                <span className="text-3xl">📤</span>
                                                <span className="text-[10px] font-black uppercase">Click para seleccionar</span>
                                            </div>
                                        )}
                                        <input type="file" id="estudioFile" hidden onChange={handleFileChange} accept="image/*" />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowUpload(false)}
                                        className={`flex-1 py-3 rounded-xl font-black text-sm uppercase transition-all ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                                    >
                                        Cerrar
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={saving}
                                        className="flex-[2] py-3 rounded-xl bg-blue-600 text-white font-black text-sm uppercase shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                                    >
                                        {saving ? 'Guardando...' : 'Guardar Estudio'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal de Imagen (Zoom) */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer"
                    >
                        <motion.img 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            src={selectedImage} alt="Estudio Zoom" 
                            className="max-w-full max-h-full rounded-2xl shadow-2xl" 
                        />
                        <div className="absolute top-6 right-6 text-white font-black text-xl">✕</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
