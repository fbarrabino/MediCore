import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { obtenerTurnosDeHoy, actualizarEstadoTurno, cancelarTurno } from '../services/turnoService';
import AgregarTurnoModal from './AgregarTurnoModal';
import { useTheme } from '../ThemeContext';
import { toast } from 'react-toastify';

/* ─── Avatar helpers ─────────────────────────────── */
const AVATAR_GRADIENTS = [
    'linear-gradient(135deg,#3b82f6,#6366f1)',
    'linear-gradient(135deg,#10b981,#0891b2)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
    'linear-gradient(135deg,#06b6d4,#2563eb)',
    'linear-gradient(135deg,#f97316,#eab308)',
];
const avatarGradient = (name = '') => AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
const initials = (name = '') => name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';

/* ─── Estado chip ─────────────────────────────────── */
const ESTADO_CONFIG = {
    EN_SALA_DE_ESPERA: { label: 'En espera', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-400 animate-pulse' },
    PENDIENTE:         { label: 'Pendiente', color: 'bg-amber-500/15 text-amber-400 border-amber-500/25',   dot: 'bg-amber-400' },
    ATENDIDO:          { label: 'Atendido',  color: 'bg-blue-500/15 text-blue-400 border-blue-500/25',       dot: 'bg-blue-400' },
    CANCELADO:         { label: 'Cancelado', color: 'bg-red-500/15 text-red-400 border-red-500/25',          dot: 'bg-red-400' },
};

function EstadoChip({ estado }) {
    const cfg = ESTADO_CONFIG[estado] || { label: estado, color: 'bg-slate-500/15 text-slate-400 border-slate-500/25', dot: 'bg-slate-400' };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

/* ─── Formatters ─────────────────────────────────── */
const formatTime = (isoString) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
};

/* ─── Tarjeta Sala de Espera ─────────────────────── */
function WalkInCard({ turno, isDarkMode, onAtender, onCancelar }) {
    const [loadingAtender, setLoadingAtender] = useState(false);
    const [loadingCancelar, setLoadingCancelar] = useState(false);

    const handleAtender = async () => {
        setLoadingAtender(true);
        await onAtender(turno.id);
        setLoadingAtender(false);
    };
    const handleCancelar = async () => {
        setLoadingCancelar(true);
        await onCancelar(turno.id);
        setLoadingCancelar(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className={`relative group flex items-start gap-3.5 p-4 rounded-2xl border transition-all ${
                isDarkMode
                    ? 'bg-slate-800/70 border-slate-700/60 hover:border-emerald-500/40 hover:bg-slate-800'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
            }`}
        >
            {/* Colored left stripe */}
            <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500 opacity-80" />

            {/* Avatar */}
            <div
                className="w-11 h-11 rounded-2xl text-white text-sm font-black flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: avatarGradient(turno.paciente?.nombre) }}
            >
                {initials(turno.paciente?.nombre)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className={`font-black text-sm leading-tight truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                        {turno.paciente?.nombre} {turno.paciente?.apellido || ''}
                    </p>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                        🕐 {formatTime(turno.fechaCreacion || turno.fechaHora)}
                    </span>
                </div>
                {turno.motivoConsulta && (
                    <p className={`text-xs mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {turno.motivoConsulta}
                    </p>
                )}
                <div className="flex items-center gap-2 mt-2.5">
                    <EstadoChip estado={turno.estado} />
                    {turno.estado === 'EN_SALA_DE_ESPERA' && (
                        <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={handleAtender}
                            disabled={loadingAtender}
                            className="ml-auto text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg text-white transition-all disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg,#2563eb,#6366f1)', boxShadow: '0 2px 10px -2px rgba(99,102,241,0.45)' }}
                        >
                            {loadingAtender ? '⟳' : 'Atender →'}
                        </motion.button>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={handleCancelar}
                        disabled={loadingCancelar}
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
                            isDarkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
                        }`}
                    >
                        {loadingCancelar ? '⟳' : '✕'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Empty State ─────────────────────────────────── */
function EmptyState({ emoji, title, subtitle, isDarkMode }) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 text-center gap-2 opacity-70 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
            <span className="text-4xl">{emoji}</span>
            <p className="font-bold text-sm">{title}</p>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>
        </div>
    );
}

/* ─── PanelTurnos ─────────────────────────────────── */
export default function PanelTurnos() {
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('sala');
    const [turnosHoy, setTurnosHoy] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | 'ORDEN_LLEGADA' | 'AGENDADO'

    const cargarTurnos = useCallback(async () => {
        try {
            const data = await obtenerTurnosDeHoy();
            setTurnosHoy(Array.isArray(data) ? data : []);
        } catch {
            // Silently fail on background refresh
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarTurnos();
        const interval = setInterval(cargarTurnos, 30000);
        return () => clearInterval(interval);
    }, [cargarTurnos]);

    const handleAtender = async (id) => {
        try {
            const updated = await actualizarEstadoTurno(id, 'ATENDIDO');
            setTurnosHoy((prev) => prev.map((t) => (t.id === id ? updated : t)));
            toast.success('Turno marcado como atendido');
        } catch (e) {
            toast.error(e.message);
        }
    };



    const handleCancelar = async (id) => {
        try {
            await cancelarTurno(id);
            setTurnosHoy((prev) => prev.map((t) => (t.id === id ? { ...t, estado: 'CANCELADO' } : t)));
            toast.info('Turno cancelado');
        } catch (e) {
            toast.error(e.message);
        }
    };

    const handleTurnoCreado = (turno) => {
        setTurnosHoy((prev) => [...prev, turno]);
        toast.success('🟢 Paciente ingresado a sala de espera');
    };

    // Derived lists
    const salaDeEspera = turnosHoy
        .filter((t) => t.tipo === 'ORDEN_LLEGADA' && t.estado !== 'CANCELADO')
        .sort((a, b) => new Date(a.fechaCreacion || a.fechaHora) - new Date(b.fechaCreacion || b.fechaHora));


    const enEsperaCount = salaDeEspera.filter((t) => t.estado === 'EN_SALA_DE_ESPERA').length;

    /* ---- Style tokens ---- */
    const panelBg = isDarkMode ? 'bg-slate-900/70 border-slate-700/60' : 'bg-white/90 border-slate-200/80';
    const tabBase = `flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all`;
    const tabActive = 'text-white shadow-sm';
    const tabInactive = isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100';

    return (
        <>
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
                className={`w-full rounded-3xl border backdrop-blur-md mb-7 overflow-hidden ${panelBg}`}
                style={{ boxShadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.06)' }}
            >
                {/* ── Panel Header ── */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 pt-5 pb-4 border-b ${isDarkMode ? 'border-slate-700/60' : 'border-slate-200/80'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                            style={{ background: isDarkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)' }}>
                            🏥
                        </div>
                        <div>
                            <h2 className={`font-black text-base leading-none ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                Panel de Hoy
                            </h2>
                            <p className={`text-[11px] font-medium mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-wrap">
                        <motion.button
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                            onClick={() => setModal('ORDEN_LLEGADA')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm ${isDarkMode ? 'text-white' : 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 shadow-sm'}`}
                            style={isDarkMode ? { background: 'linear-gradient(135deg,#10b981,#0891b2)', boxShadow: '0 3px 14px -3px rgba(16,185,129,0.5)' } : {}}
                            id="btn-agregar-sala"
                        >
                            <span>🟢</span>
                            <span>Agregar a Sala</span>
                        </motion.button>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="px-5 pb-5 pt-3 min-h-[200px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-16 gap-3 opacity-60">
                            <span className="animate-spin text-2xl">⟳</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Cargando turnos...</span>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2.5"
                        >
                            <AnimatePresence>
                                {salaDeEspera.length === 0 ? (
                                    <EmptyState emoji="🛋️" title="Sala de espera vacía" subtitle="Los pacientes sin turno aparecerán aquí" isDarkMode={isDarkMode} />
                                ) : (
                                    salaDeEspera.map((t) => (
                                        <WalkInCard
                                            key={t.id}
                                            turno={t}
                                            isDarkMode={isDarkMode}
                                            onAtender={handleAtender}
                                            onCancelar={handleCancelar}
                                        />
                                    ))
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </motion.section>

            {/* Modals */}
            <AgregarTurnoModal
                isOpen={modal === 'ORDEN_LLEGADA'}
                tipo="ORDEN_LLEGADA"
                onClose={() => setModal(null)}
                onTurnoCreado={handleTurnoCreado}
            />
        </>
    );
}
