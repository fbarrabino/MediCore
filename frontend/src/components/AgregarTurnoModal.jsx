import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { crearTurno } from '../services/turnoService';
import { obtenerTodosLosPacientes } from '../services/pacienteService';
import { useTheme } from '../ThemeContext';

/**
 * AgregarTurnoModal
 * Props:
 *   isOpen      – boolean
 *   tipo        – 'ORDEN_LLEGADA' | 'AGENDADO'
 *   onClose     – () => void
 *   onTurnoCreado – (turno) => void
 *   initialDate   - Date (optional)
 */
export default function AgregarTurnoModal({ isOpen, tipo, onClose, onTurnoCreado, initialDate }) {
    const { isDarkMode } = useTheme();
    const [pacienteId, setPacienteId] = useState('');
    const [pacientes, setPacientes] = useState([]);
    const [motivo, setMotivo] = useState('');
    const [fechaHora, setFechaHora] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const firstInputRef = useRef(null);

    const isAgendado = tipo === 'AGENDADO';

    // Reset form and fetch patients when modal opens
    useEffect(() => {
        if (isOpen) {
            setPacienteId('');
            setMotivo('');
            setError('');
            
            // Fetch patients
            obtenerTodosLosPacientes()
                .then(data => setPacientes(data || []))
                .catch(err => console.error("Error fetching patients:", err));

            const pad = (n) => String(n).padStart(2, '0');
            if (initialDate instanceof Date) {
                 setFechaHora(`${initialDate.getFullYear()}-${pad(initialDate.getMonth() + 1)}-${pad(initialDate.getDate())}T${pad(initialDate.getHours())}:${pad(initialDate.getMinutes())}`);
            } else {
                 // Default datetime to now + 1h rounded to nearest 15min
                 const now = new Date();
                 now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);
                 now.setHours(now.getHours() + (isAgendado ? 1 : 0));
                 setFechaHora(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`);
            }
            setTimeout(() => firstInputRef.current?.focus(), 100);
        }
    }, [isOpen, isAgendado, initialDate]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!pacienteId) { setError('Por favor, selecciona un paciente.'); return; }
        if (isAgendado && !fechaHora) { setError('La fecha y hora son requeridas para un turno agendado.'); return; }

        setLoading(true);
        try {
            const dto = {
                pacienteId: Number(pacienteId),
                motivoConsulta: motivo.trim() || null,
                tipo,
                ...(isAgendado && { fechaHora }),
                googleAccessToken: localStorage.getItem('google_access_token') || null,
            };
            const turno = await crearTurno(dto);
            onTurnoCreado(turno);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const pacientesFiltrados = pacientes.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.apellido && p.apellido.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const labelClass = `block text-xs font-bold uppercase tracking-widest mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`;
    const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/40 font-medium text-sm ${
        isDarkMode
            ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500'
            : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
    }`;

    const titleText = isAgendado ? 'Agendar Turno' : 'Agregar a Sala de Espera';
    const titleEmoji = isAgendado ? '📅' : '🟢';
    const accentColor = isAgendado ? 'from-violet-600 to-indigo-600' : 'from-emerald-500 to-teal-500';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal panel */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 8 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className={`w-full max-w-md rounded-3xl shadow-2xl pointer-events-auto border ${
                                isDarkMode
                                    ? 'bg-slate-900 border-slate-700'
                                    : 'bg-white border-slate-200'
                            }`}
                            style={{ boxShadow: '0 32px 64px -12px rgba(0,0,0,0.35)' }}
                        >
                            {/* Header */}
                            <div className={`bg-gradient-to-r ${accentColor} rounded-t-3xl p-6 relative overflow-hidden`}>
                                <div className="absolute inset-0 opacity-20"
                                    style={{
                                        backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)',
                                    }}
                                />
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{titleEmoji}</span>
                                        <div>
                                            <h2 className="text-white font-black text-lg leading-none">{titleText}</h2>
                                            <p className="text-white/70 text-xs font-medium mt-0.5">
                                                {isAgendado ? 'Agenda un turno con fecha y hora' : 'Registra llegada en tiempo real'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-white/70 hover:text-white transition-colors w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-3">
                                    <label className={labelClass}>Paciente *</label>
                                    
                                    {/* Search Input */}
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre o DNI..."
                                            autoComplete="off"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className={`${inputClass} pl-10 py-2 text-xs h-10`}
                                        />
                                    </div>

                                    <select
                                        ref={firstInputRef}
                                        className={inputClass}
                                        value={pacienteId}
                                        onChange={(e) => setPacienteId(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            {pacientesFiltrados.length === 0 ? 'No se encontraron pacientes' : 'Selecciona un paciente...'}
                                        </option>
                                        {pacientesFiltrados.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre} {p.apellido || ''} (DNI: {p.dni})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Fecha y hora (solo para AGENDADO) */}
                                {isAgendado && (
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-3">
                                            <label className={labelClass}>Seleccionar Fecha</label>
                                            <input
                                                type="date"
                                                className={`${inputClass} !py-2`}
                                                value={fechaHora.split('T')[0]}
                                                onChange={(e) => {
                                                    const newDate = e.target.value;
                                                    const currentTime = fechaHora.split('T')[1] || '09:00';
                                                    setFechaHora(`${newDate}T${currentTime}`);
                                                }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={labelClass}>Seleccionar Horario</label>
                                            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                                                {Array.from({ length: 13 }, (_, i) => i + 8).map(hour => (
                                                    ['00', '15', '30', '45'].map(minute => {
                                                        const timeStr = `${String(hour).padStart(2, '0')}:${minute}`;
                                                        const isSelected = fechaHora.split('T')[1] === timeStr;
                                                        return (
                                                            <button
                                                                key={timeStr}
                                                                type="button"
                                                                onClick={() => {
                                                                    const currentDate = fechaHora.split('T')[0];
                                                                    setFechaHora(`${currentDate}T${timeStr}`);
                                                                }}
                                                                className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                                                                    isSelected
                                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30'
                                                                        : isDarkMode
                                                                            ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                                                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                                                }`}
                                                            >
                                                                {timeStr}
                                                            </button>
                                                        );
                                                    })
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Motivo */}
                                <div>
                                    <label className={labelClass}>Motivo de Consulta <span className="normal-case font-normal opacity-60">(opcional)</span></label>
                                    <textarea
                                        placeholder=""
                                        autoComplete="off"
                                        className={`${inputClass} resize-none`}
                                        rows={2}
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                    />
                                </div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                                        >
                                            <span>⚠️</span> {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Actions */}
                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                                            isDarkMode
                                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        Cancelar
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        type="submit"
                                        disabled={loading}
                                        className={`flex-1 py-3 rounded-xl font-black text-sm text-white transition-all disabled:opacity-60 bg-gradient-to-r ${accentColor}`}
                                        style={{ boxShadow: '0 4px 20px -4px rgba(99,102,241,0.5)' }}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin">⟳</span> Guardando...
                                            </span>
                                        ) : (
                                            isAgendado ? 'Agendar Turno ✓' : 'Ingresar a Sala ✓'
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
