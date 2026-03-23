import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { obtenerReportes } from '../services/reporteService';
import { toast } from 'react-toastify';

const COLORS = ['#60a5fa', '#34d399', '#6366f1', '#fbbf24'];

export default function ReportesView() {
    const { isDarkMode, cardBg } = useOutletContext();
    const [periodo, setPeriodo] = useState('6_meses');
    const [vistaGrafico, setVistaGrafico] = useState('mensual'); // 'mensual' | 'diario'
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        obtenerReportes(periodo)
            .then(data => {
                setStats(data);
                if (periodo === 'mes_actual') setVistaGrafico('diario');
                else setVistaGrafico('mensual');
            })
            .catch(err => {
                console.error(err);
                toast.error('Error al cargar las estadísticas reales.');
            })
            .finally(() => setLoading(false));
    }, [periodo]);

    const KpiCard = ({ title, value, trend, isPositive, icon, colorClass }) => (
        <motion.div 
            whileHover={{ y: -4 }}
            className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between ${cardBg}`}
        >
            <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
                <div className="flex items-end gap-3">
                    <h4 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{value}</h4>
                    {trend && (
                        <span className={`text-xs font-bold mb-1 px-2 py-0.5 rounded-md ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            {trend}
                        </span>
                    )}
                </div>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colorClass}`}>
                {icon}
            </div>
        </motion.div>
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-3 rounded-xl border shadow-xl ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                    <p className="font-bold mb-1 text-sm">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-xs font-medium" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin text-4xl text-blue-600">⟳</div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full pb-8">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Reportes y Estadísticas</h2>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Visualiza métricas y tendencias reales de tus pacientes registrados.</p>
                </div>
                <select 
                    value={periodo} 
                    onChange={(e) => setPeriodo(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border outline-none cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                >
                    <option value="mes_actual">Mes Actual</option>
                    <option value="6_meses">Últimos 6 Meses</option>
                    <option value="totalidad">Totalidad</option>
                </select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <KpiCard title="Total Pacientes" value={stats.totalPacientes} icon="👥" colorClass={isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'} />
                <KpiCard title="Turnos Atendidos" value={stats.turnosAtendidos} icon="🏥" colorClass={isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'} />
                <KpiCard title="Tasa de Ausentismo" value={stats.tasaAusentismo} icon="📉" colorClass={isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Bar Chart */}
                <div className={`col-span-1 lg:col-span-2 p-6 rounded-3xl border shadow-sm ${cardBg}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            Historial de Turnos {vistaGrafico === 'diario' ? '(Día por Día)' : '(Por Mes)'}
                        </h3>
                        <div className={`flex p-1 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <button 
                                onClick={() => setVistaGrafico('diario')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${vistaGrafico === 'diario' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Día
                            </button>
                            <button 
                                onClick={() => setVistaGrafico('mensual')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${vistaGrafico === 'mensual' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Mes
                            </button>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={vistaGrafico === 'diario' ? stats.turnosDiarios : stats.turnosMensuales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAtendidos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorAusentes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                                <XAxis 
                                    dataKey={vistaGrafico === 'diario' ? 'dia' : 'mes'} 
                                    axisLine={false} tickLine={false} 
                                    tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10 }} 
                                    dy={10}
                                    interval={vistaGrafico === 'diario' ? 2 : 0}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="atendidos" name="Atendidos" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAtendidos)" />
                                <Area type="monotone" dataKey="ausentes" name="Ausentes" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorAusentes)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Demographics Pie Chart */}
                <div className={`col-span-1 p-6 rounded-3xl border shadow-sm flex flex-col ${cardBg}`}>
                    <h3 className={`text-base font-black mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Demografía (Edades)</h3>
                    <div className="flex-1 h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.demografiaEdades}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.demografiaEdades.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pacientes</span>
                            <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Activos</span>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {stats.demografiaEdades.map((d, i) => (
                            <div key={d.name} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                                <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
