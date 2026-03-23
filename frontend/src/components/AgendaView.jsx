import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { obtenerTurnosDeHoy, obtenerTodosLosTurnos, actualizarEstadoTurno, cancelarTurno } from '../services/turnoService';
import AgregarTurnoModal from './AgregarTurnoModal';
import GoogleSyncModal from './GoogleSyncModal';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';

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

const formatTime = (isoString) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
};

const formatDateToGridKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

function AgendaCard({ turno, isDarkMode, onCambiarEstado, onCancelar }) {
    const [loading, setLoading] = useState(false);

    const nextEstado = turno.estado === 'PENDIENTE' ? 'EN_SALA_DE_ESPERA' : turno.estado === 'EN_SALA_DE_ESPERA' ? 'ATENDIDO' : null;
    const nextLabel = nextEstado === 'EN_SALA_DE_ESPERA' ? 'Llegó →' : nextEstado === 'ATENDIDO' ? 'Atendido ✓' : null;

    const handleNext = async () => {
        setLoading(true);
        await onCambiarEstado(turno.id, nextEstado);
        setLoading(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className={`relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all ${
                isDarkMode
                    ? 'bg-slate-800/70 border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
            }`}
        >
            <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-2xl font-black text-xs text-white text-center leading-tight shadow-sm"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                {formatTime(turno.fechaHora).split(':').map((part, i) => (
                    <span key={i} className={i === 0 ? 'text-base leading-none' : 'text-[10px] opacity-80'}>{part}</span>
                ))}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-between">
                    <p className={`font-black text-sm leading-tight truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                        {turno.paciente?.nombre} {turno.paciente?.apellido || ''}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                        onClick={() => onCancelar(turno.id)}
                        className={`text-xs px-2 py-1 rounded-lg shrink-0 transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}
                        title="Cancelar Turno"
                    >✕</motion.button>
                </div>
                {turno.motivoConsulta && (
                    <p className={`text-xs mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{turno.motivoConsulta}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                    <EstadoChip estado={turno.estado} />
                    {nextLabel && (
                        <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={handleNext}
                            disabled={loading}
                            className="ml-auto text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg text-white disabled:opacity-50 transition-all shadow-sm shadow-blue-500/30 hover:shadow-blue-500/50"
                            style={{ background: 'linear-gradient(135deg,#2563eb,#6366f1)' }}
                        >
                            {loading ? '⟳' : nextLabel}
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function EmptyState({ emoji, title, subtitle, isDarkMode }) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 text-center gap-2 opacity-70 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
            <span className="text-4xl">{emoji}</span>
            <p className="font-bold text-sm">{title}</p>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>
        </div>
    );
}

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function AgendaView() {
    const { isDarkMode, cardBg } = useOutletContext();
    
    // View mode: 'list' (hoy) | 'calendar'
    const [viewMode, setViewMode] = useState('list');
    
    // Modals
    const [modalAbierto, setModalAbierto] = useState(false);
    const [syncModalAbierto, setSyncModalAbierto] = useState(false);

    // List view state
    const [turnosHoy, setTurnosHoy] = useState([]);
    const [loadingHoy, setLoadingHoy] = useState(true);

    // Calendar view state
    const [turnosTodos, setTurnosTodos] = useState([]);
    const [loadingTodos, setLoadingTodos] = useState(false);
    
    // Calendar cursor state
    const [mesActual, setMesActual] = useState(new Date().getMonth());
    const [anioActual, setAnioActual] = useState(new Date().getFullYear());
    const [diaSeleccionado, setDiaSeleccionado] = useState(formatDateToGridKey(new Date()));

    const cargarTurnosHoy = useCallback(async () => {
        try {
            const data = await obtenerTurnosDeHoy();
            setTurnosHoy(Array.isArray(data) ? data : []);
        } catch { } finally { setLoadingHoy(false); }
    }, []);

    const cargarTodosLosTurnos = useCallback(async () => {
        setLoadingTodos(true);
        try {
            const data = await obtenerTodosLosTurnos();
            setTurnosTodos(Array.isArray(data) ? data : []);
        } catch { } finally { setLoadingTodos(false); }
    }, []);

    useEffect(() => {
        cargarTurnosHoy();
        const interval = setInterval(cargarTurnosHoy, 30000); // 30s auto-refresh for today
        return () => clearInterval(interval);
    }, [cargarTurnosHoy]);

    useEffect(() => {
        if (viewMode === 'calendar' && turnosTodos.length === 0) {
            cargarTodosLosTurnos();
        }
    }, [viewMode, turnosTodos.length, cargarTodosLosTurnos]);

    const handleCambiarEstado = async (id, estado) => {
        try {
            const updated = await actualizarEstadoTurno(id, estado);
            setTurnosHoy((prev) => prev.map((t) => (t.id === id ? updated : t)));
            setTurnosTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
        } catch (e) { toast.error(e.message); }
    };

    const handleCancelar = async (id) => {
        try {
            await cancelarTurno(id);
            setTurnosHoy((prev) => prev.map((t) => (t.id === id ? { ...t, estado: 'CANCELADO' } : t)));
            setTurnosTodos((prev) => prev.map((t) => (t.id === id ? { ...t, estado: 'CANCELADO' } : t)));
            toast.info('Turno cancelado');
        } catch (e) { toast.error(e.message); }
    };

    const handleTurnoCreado = (turno) => {
        setTurnosHoy((prev) => [...prev, turno]);
        setTurnosTodos((prev) => [...prev, turno]);
        toast.success('📅 Turno agendado con éxito');
    };

    const handlePrevMonth = () => {
        if (mesActual === 0) { setMesActual(11); setAnioActual(anioActual - 1); }
        else { setMesActual(mesActual - 1); }
    };

    const handleNextMonth = () => {
        if (mesActual === 11) { setMesActual(0); setAnioActual(anioActual + 1); }
        else { setMesActual(mesActual + 1); }
    };

    // Filter today list
    const agendaHoy = turnosHoy
        .filter((t) => t.tipo === 'AGENDADO' && t.estado !== 'CANCELADO')
        .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

    // Mapper for Calendar Grid
    const turnosMesAgrupados = useMemo(() => {
        const mapa = {};
        const agendados = turnosTodos.filter((t) => t.tipo === 'AGENDADO' && t.estado !== 'CANCELADO');
        agendados.forEach(t => {
            const d = new Date(t.fechaHora);
            const key = formatDateToGridKey(d);
            if (!mapa[key]) mapa[key] = [];
            mapa[key].push(t);
        });
        return mapa;
    }, [turnosTodos]);

    // Calendar logic
    const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();
    const diaInicioSemana = new Date(anioActual, mesActual, 1).getDay(); // 0(Sun) - 6(Sat)
    const prevDiasBlank = diaInicioSemana === 0 ? 6 : diaInicioSemana - 1; // Start on Monday

    const renderCalendarGrid = () => {
        const grid = [];
        const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

        // Header
        daysOfWeek.forEach(d => grid.push(<div key={`d-${d}`} className="text-center text-xs font-bold text-slate-500 py-2">{d}</div>));
        // Blank prev days
        for (let i = 0; i < prevDiasBlank; i++) grid.push(<div key={`blank-${i}`} className="p-2" />);
        // Days
        for (let day = 1; day <= diasEnMes; day++) {
            const key = `${anioActual}-${String(mesActual + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = key === formatDateToGridKey(new Date());
            const hasTurnos = turnosMesAgrupados[key] && turnosMesAgrupados[key].length > 0;
            const isSelected = diaSeleccionado === key;

            grid.push(
                <div 
                    key={`day-${day}`}
                    onClick={() => setDiaSeleccionado(key)}
                    className={`relative p-2 flex flex-col items-center justify-center aspect-square rounded-2xl cursor-pointer border transition-all 
                    ${isSelected ? (isDarkMode ? 'border-indigo-400 bg-indigo-500/20 shadow-sm' : 'border-indigo-500 bg-indigo-50 shadow-sm') : isToday ? (isDarkMode ? 'border-dashed border-blue-400 bg-blue-900/20' : 'border-dashed border-blue-400 bg-blue-50/50') : (isDarkMode ? 'border-transparent hover:bg-slate-800' : 'border-transparent hover:bg-slate-100')}`}
                >
                    <span className={`text-sm font-black ${hasTurnos ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-600') : (isDarkMode ? 'text-slate-300' : 'text-slate-800')}`}>
                        {day}
                    </span>
                    {hasTurnos && (
                        <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                    )}
                </div>
            );
        }
        return grid;
    };

    const turnosDiaSeleccionado = turnosMesAgrupados[diaSeleccionado] 
        ? turnosMesAgrupados[diaSeleccionado].sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)) 
        : [];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Agenda Médica</h2>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Visualiza tus turnos y sincroniza con Google Calendar.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setSyncModalAbierto(true)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition-colors border ${isDarkMode ? 'text-slate-300 border-slate-700 hover:bg-slate-800' : 'text-slate-600 border-slate-300 hover:bg-slate-100'}`}
                        title="Vincular con cuentas externas"
                    >
                        <span>🔗</span>
                        <span>Google Sync</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                        onClick={() => setModalAbierto(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm text-white shadow-sm transition-all`}
                        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 3px 14px -3px rgba(99,102,241,0.4)' }}
                    >
                        <span>➕</span>
                        <span>Nuevo Turno</span>
                    </motion.button>
                </div>
            </div>

            {/* Toggle Buscador y Vistas */}
            <div className={`mb-6 flex gap-2 p-1.5 rounded-2xl w-fit shadow-inner ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200/50'}`}>
                <button 
                    onClick={() => { setViewMode('list'); }}
                    className={`px-5 py-2 rounded-xl text-sm font-black tracking-wide transition-all ${viewMode === 'list' ? (isDarkMode ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : (isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')}`}
                >
                    Hoy (Lista)
                </button>
                <button 
                    onClick={() => { setViewMode('calendar'); }}
                    className={`px-5 py-2 rounded-xl text-sm font-black tracking-wide transition-all ${viewMode === 'calendar' ? (isDarkMode ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : (isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')}`}
                >
                    Vista Calendario
                </button>
            </div>

            {/* AREA PRINCIPAL */}
            <div className={`p-6 rounded-3xl border min-h-[400px] shadow-sm ${cardBg}`}>
                <AnimatePresence mode="wait">
                    {/* VISTA LISTA (HOY) */}
                    {viewMode === 'list' && (
                        <motion.div key="list" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-lg font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Turnos del Día ({new Date().toLocaleDateString('es-AR')})</h3>
                                <button onClick={cargarTurnosHoy} className="text-slate-500 hover:text-indigo-500 transition-colors" title="Recargar turnos">⟳</button>
                            </div>
                            {loadingHoy ? (
                                <div className="flex items-center justify-center py-16 gap-3 opacity-60 text-slate-500 font-medium">
                                    <span className="animate-spin text-2xl">⟳</span>
                                    <span>Cargando turnos de hoy...</span>
                                </div>
                            ) : agendaHoy.length === 0 ? (
                                <EmptyState emoji="🎉" title="Día libre" subtitle="No hay turnos agendados para este momento" isDarkMode={isDarkMode} />
                            ) : (
                                <div className="space-y-3">
                                    {agendaHoy.map(t => (
                                        <AgendaCard key={t.id} turno={t} isDarkMode={isDarkMode} onCambiarEstado={handleCambiarEstado} onCancelar={handleCancelar} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* VISTA CALENDARIO */}
                    {viewMode === 'calendar' && (
                        <motion.div key="calendar" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col lg:flex-row gap-8">
                            
                            {/* Panel Izquierdo: Calendario interactivo */}
                            <div className="lg:w-2/5 shrink-0 flex flex-col">
                                <div className="flex justify-between items-center mb-6 px-2">
                                    <button onClick={handlePrevMonth} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                    </button>
                                    <span className={`text-lg font-black capitalize tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                        {MESES[mesActual]} {anioActual}
                                    </span>
                                    <button onClick={handleNextMonth} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {renderCalendarGrid()}
                                </div>
                            </div>

                            <div className={`hidden lg:block w-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                            <div className={`block lg:hidden h-px my-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

                            {/* Panel Derecho: Detalles del día */}
                            <div className="flex-1 flex flex-col min-h-[300px]">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className={`text-lg font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                        Turnos del {diaSeleccionado.split('-').reverse().join('/')}
                                    </h3>
                                    {loadingTodos && <span className="text-slate-400 text-xs font-bold animate-pulse">Cargando...</span>}
                                </div>
                                
                                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                                    {turnosDiaSeleccionado.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 opacity-60 text-center">
                                            <span className="text-3xl mb-2">🏖️</span>
                                            <p className="text-sm font-bold text-slate-500">Sin turnos agendados en esta fecha</p>
                                        </div>
                                    ) : (
                                        turnosDiaSeleccionado.map(t => (
                                            <AgendaCard key={`cal-${t.id}`} turno={t} isDarkMode={isDarkMode} onCambiarEstado={handleCambiarEstado} onCancelar={handleCancelar} />
                                        ))
                                    )}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AgregarTurnoModal
                isOpen={modalAbierto}
                tipo="AGENDADO"
                onClose={() => setModalAbierto(false)}
                onTurnoCreado={handleTurnoCreado}
            />

            <GoogleSyncModal 
                isOpen={syncModalAbierto}
                onClose={() => setSyncModalAbierto(false)}
            />
        </motion.div>
    );
}
