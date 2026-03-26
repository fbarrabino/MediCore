import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';

const API_BASE = 'http://localhost:8080';

const getHeaders = () => {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export default function RecordatoriosView() {
  const { isDarkMode, planActual, esBasico } = useOutletContext();

  // Config del servidor
  const [config, setConfig] = useState({ recordatoriosActivos: true, recordatorioMensaje: '' });
  const [mensajeEdit, setMensajeEdit] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Turnos próximos con email
  const [turnosConEmail, setTurnosConEmail] = useState([]);
  const [loadingTurnos, setLoadingTurnos] = useState(true);

  // Test trigger
  const [testando, setTestando] = useState(false);

  const card = isDarkMode
    ? 'bg-slate-800/70 border-slate-700'
    : 'bg-white/90 border-slate-200';

  const labelClass = `text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`;

  // ── Carga la config ──────────────────────────────────────────────────────────
  const loadConfig = useCallback(async () => {
    setLoadingConfig(true);
    try {
      const res = await fetch(`${API_BASE}/api/recordatorios/config`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setMensajeEdit(data.recordatorioMensaje || '');
      }
    } catch { /* silent */ }
    finally { setLoadingConfig(false); }
  }, []);

  // ── Carga turnos de mañana con email ─────────────────────────────────────────
  const loadTurnos = useCallback(async () => {
    setLoadingTurnos(true);
    try {
      const res = await fetch(`${API_BASE}/api/turnos`, { headers: getHeaders() });
      if (res.ok) {
        const all = await res.json();
        const hoy = new Date();
        const manana = new Date(hoy);
        manana.setDate(hoy.getDate() + 1);
        const enSemana = new Date(hoy);
        enSemana.setDate(hoy.getDate() + 7);

        const filtrados = all.filter(t => {
          const f = new Date(t.fechaHora);
          return (
            t.tipo === 'AGENDADO' &&
            t.estado !== 'CANCELADO' &&
            t.estado !== 'ATENDIDO' &&
            t.paciente?.emailPaciente &&
            f >= manana &&
            f <= enSemana
          );
        });
        filtrados.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
        setTurnosConEmail(filtrados);
      }
    } catch { /* silent */ }
    finally { setLoadingTurnos(false); }
  }, []);

  useEffect(() => {
    loadConfig();
    loadTurnos();
  }, [loadConfig, loadTurnos]);

  // ── Toggle recordatorios ON/OFF ───────────────────────────────────────────────
  const handleToggle = async () => {
    const nuevo = !config.recordatoriosActivos;
    try {
      const res = await fetch(`${API_BASE}/api/recordatorios/config`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ recordatoriosActivos: nuevo }),
      });
      if (res.ok) {
        setConfig(c => ({ ...c, recordatoriosActivos: nuevo }));
        toast.success(nuevo ? '✅ Recordatorios activados' : '🔕 Recordatorios desactivados');
      }
    } catch { toast.error('Error al cambiar configuración'); }
  };

  // ── Guardar mensaje personalizado ─────────────────────────────────────────────
  const handleSaveMensaje = async () => {
    setSavingConfig(true);
    try {
      const res = await fetch(`${API_BASE}/api/recordatorios/config`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ recordatorioMensaje: mensajeEdit }),
      });
      if (res.ok) {
        setConfig(c => ({ ...c, recordatorioMensaje: mensajeEdit }));
        toast.success('💾 Mensaje personalizado guardado');
      }
    } catch { toast.error('Error al guardar el mensaje'); }
    finally { setSavingConfig(false); }
  };

  // ── Test manual de envío ───────────────────────────────────────────────────────
  const handleTestEnvio = async () => {
    setTestando(true);
    try {
      const res = await fetch(`${API_BASE}/api/test/enviar-recordatorios`, {
        method: 'POST',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('📧 ' + data.message);
      } else {
        toast.error('Error: ' + (data.error || 'Desconocido'));
      }
    } catch { toast.error('Error de conexión'); }
    finally { setTestando(false); }
  };

  const mensajePredeterminado = `¡Hola, [Nombre del Paciente]! 🗓️\n\nTe recordamos que mañana tenés turno médico:\n📅 [Fecha] a las 🕐 [Hora] hs\n\n✅ Recordá llegar 10 minutos antes y traer tu documentación.\n\nSi no podés asistir, avisá con anticipación. ¡Muchas gracias!\n\n— MediCore`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl mx-auto pb-20"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg"
          style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}
        >
          📧
        </div>
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Recordatorios Automáticos
          </h1>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Configurá los avisos por email que se envían 24 hs antes del turno
          </p>
        </div>
        {esBasico && (
          <div className="ml-auto px-3 py-1.5 rounded-xl text-xs font-black bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/30">
            ⭐ Solo Premium
          </div>
        )}
      </div>

      {esBasico ? (
        // ── Locked state para plan BÁSICO ──
        <div className={`rounded-3xl border p-10 text-center shadow-sm ${card}`}>
          <div className="text-5xl mb-4">🔒</div>
          <h2 className={`text-xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Función Premium
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Los recordatorios automáticos por email están disponibles únicamente en el Plan Premium.
          </p>
        </div>
      ) : (
        <>
          {/* ── Card 1: Activar/Desactivar ── */}
          <div className={`rounded-3xl border shadow-sm p-6 ${card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Estado del sistema
                </p>
                <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {config.recordatoriosActivos
                    ? '🟢 Los pacientes con email recibirán un recordatorio el día anterior a su turno a las 09:00 AM'
                    : '🔴 Los recordatorios están pausados. Los pacientes NO recibirán emails.'}
                </p>
              </div>
              {!loadingConfig && (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleToggle}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 shrink-0 ml-6 ${
                    config.recordatoriosActivos
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: config.recordatoriosActivos ? 32 : 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              )}
            </div>
          </div>

          {/* ── Card 2: Mensaje personalizado ── */}
          <div className={`rounded-3xl border shadow-sm p-6 ${card}`}>
            <h2 className={`font-black text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              📝 Mensaje del recordatorio
            </h2>
            <p className={`text-xs mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              El sistema usa un template HTML premium. Acá podés agregar una nota adicional que aparecerá en el email. 
              Los campos <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">[Nombre]</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">[Fecha]</code> y <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">[Hora]</code> se reemplazan automáticamente.
            </p>

            <div className="mb-3">
              <label className={`${labelClass} mb-2 block`}>Vista previa del mensaje predeterminado</label>
              <pre className={`text-xs p-4 rounded-2xl border whitespace-pre-wrap leading-relaxed font-mono ${
                isDarkMode ? 'bg-slate-900/50 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                {mensajePredeterminado}
              </pre>
            </div>

            <div className="mb-4">
              <label className={`${labelClass} mb-2 block`}>Nota adicional personalizada (opcional)</label>
              <textarea
                value={mensajeEdit}
                onChange={(e) => setMensajeEdit(e.target.value)}
                rows={3}
                placeholder="Ej: Por favor traer los estudios anteriores. Dr. Martínez."
                className={`w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none ${
                  isDarkMode
                    ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSaveMensaje}
                disabled={savingConfig}
                className="px-6 py-2.5 rounded-2xl font-black text-white shadow-lg disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}
              >
                {savingConfig ? '💾 Guardando...' : '💾 Guardar mensaje'}
              </motion.button>
            </div>
          </div>

          {/* ── Card 3: Turnos de la semana con email ── */}
          <div className={`rounded-3xl border shadow-sm p-6 ${card}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  📅 Recordatorios pendientes (próximos 7 días)
                </h2>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Turnos AGENDADOS con email de paciente registrado que recibirán recordatorio
                </p>
              </div>
              <button
                onClick={loadTurnos}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                  isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                🔄 Actualizar
              </button>
            </div>

            {loadingTurnos ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"/>
              </div>
            ) : turnosConEmail.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📭</div>
                <p className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  No hay turnos con email para los próximos 7 días
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Cuando crees turnos AGENDADOS para pacientes con email, aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {turnosConEmail.map(t => {
                  const fecha = new Date(t.fechaHora);
                  const esManana = fecha.toDateString() === new Date(Date.now() + 86400000).toDateString();
                  return (
                    <div
                      key={t.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        isDarkMode ? 'bg-slate-900/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shrink-0"
                          style={{ background: 'linear-gradient(135deg, #2563eb, #6366f1)' }}
                        >
                          {(t.paciente?.nombre || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            {t.paciente?.nombre || 'Paciente'}
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            📧 {t.paciente?.emailPaciente}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-black ${esManana ? 'text-amber-500' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {esManana ? '⚡ MAÑANA' : fecha.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          🕐 {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                        </p>
                        {t.recordatorioEnviado && (
                          <span className="text-[10px] font-black text-emerald-500">✓ Recordatorio enviado</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Card 4: Test manual ── */}
          <div className={`rounded-3xl border shadow-sm p-6 ${card}`}>
            <h2 className={`font-black text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              🧪 Envío de prueba
            </h2>
            <p className={`text-xs mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Procesá los recordatorios de mañana ahora mismo, sin esperar las 09:00 AM.
              Útil para verificar que los emails llegan correctamente.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleTestEnvio}
              disabled={testando || !config.recordatoriosActivos}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {testando ? '📤 Enviando...' : '📤 Enviar recordatorios ahora'}
            </motion.button>
            {!config.recordatoriosActivos && (
              <p className="text-xs text-amber-500 font-bold mt-2">
                ⚠ Activá los recordatorios primero para poder enviarlos.
              </p>
            )}
          </div>

          {/* ── Card 5: Cómo funciona ── */}
          <div className={`rounded-3xl border shadow-sm p-6 ${card}`}>
            <h2 className={`font-black text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              ℹ️ ¿Cómo funciona?
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: '👤', title: 'Registrá el email', desc: 'Al crear o editar un paciente, ingresá su email en el campo "Recordatorio Automático".' },
                { icon: '📅', title: 'Agendá el turno', desc: 'Creá un turno de tipo AGENDADO con fecha y hora exacta para ese paciente.' },
                { icon: '📧', title: 'El sistema avisa solo', desc: 'El día anterior a las 09:00 AM, el paciente recibe un email con el recordatorio del turno.' },
              ].map((step, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border ${
                    isDarkMode ? 'bg-slate-900/40 border-slate-700/60' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <p className={`font-black text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{step.title}</p>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
