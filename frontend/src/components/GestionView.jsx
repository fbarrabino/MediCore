import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/* SVG Icons */
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
  </svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);
const PaletteIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.55 1.5-1.3a1.18 1.18 0 0 0-1.18-1.18 1.05 1.05 0 0 1-1.05-1.05c0-.58.48-1.05 1.05-1.05h1.34c3.48 0 6.31-2.83 6.31-6.31C20 5.31 16.42 2 12 2z"/>
    </svg>
);

const Card = ({ title, icon, children, isDarkMode, onEdit, onSave, onCancel, isEditing, saving }) => (
  <motion.div 
    initial={false}
    animate={{ y: isEditing ? -4 : 0 }}
    className={`group p-6 rounded-3xl border shadow-sm transition-all relative ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-100 shadow-blue-900/5'}`}
  >
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-blue-500 bg-blue-500/10 border border-blue-500/20">
                {icon}
            </div>
            <h3 className={`font-black text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
        </div>
        
        <div className="flex items-center gap-2">
            {!isEditing ? (
                <button 
                    onClick={onEdit}
                    className={`opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-blue-600'
                    }`}
                >
                    ✎ Editar
                </button>
            ) : (
                <div className="flex gap-2">
                    <button 
                        onClick={onCancel}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-red-500'
                        }`}
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onSave}
                        disabled={saving}
                        className="px-4 py-1.5 rounded-xl bg-blue-600 border-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? '...' : '✓ Guardar'}
                    </button>
                </div>
            )}
        </div>
    </div>
    <div className={isEditing ? 'opacity-100' : 'opacity-60 pointer-events-none transition-opacity'}>
        {children}
    </div>
  </motion.div>
);

const TimeInput = ({ value, onChange, isDarkMode, disabled }) => {
    const handleChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Solo números
        if (val.length > 4) val = val.slice(0, 4);
        
        // Formatear HH:mm
        let formatted = val;
        if (val.length >= 3) {
            formatted = val.slice(0, 2) + ':' + val.slice(2);
        }
        
        // Validaciones básicas
        if (val.length === 4) {
            const h = parseInt(val.slice(0, 2));
            const m = parseInt(val.slice(2));
            if (h > 23 || m > 59) return; // No permitir horas/minutos inválidos
        }
        
        onChange(formatted);
    };

    return (
        <input 
            type="text" 
            value={value} 
            disabled={disabled}
            placeholder="00:00"
            maxLength={5}
            onChange={handleChange}
            className={`w-16 text-center text-xs font-bold py-1.5 rounded-lg border outline-none transition-all ${
                isDarkMode 
                ? 'bg-slate-800 border-slate-600 text-white focus:border-blue-500' 
                : 'bg-white border-slate-200 text-slate-700 focus:border-blue-400'
            } ${disabled ? 'opacity-70' : ''}`} 
        />
    );
};

const InputField = ({ label, placeholder, value, onChange, isDarkMode, disabled }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{label}</label>
    <input 
      type="text" 
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none transition-all focus:ring-4 focus:ring-blue-500/10 ${
        isDarkMode 
          ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500/50' 
          : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-blue-300'
      } ${disabled ? 'cursor-not-allowed opacity-80' : ''}`}
    />
  </div>
);

const Toggle = ({ label, enabled, isDarkMode, disabled, onClick }) => (
    <div className={`flex items-center justify-between py-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={!disabled ? onClick : undefined}>
      <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
      <div className={`w-11 h-6 rounded-full relative transition-colors ${enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'} ${disabled ? 'opacity-50' : ''}`}>
        <motion.div 
            animate={{ x: enabled ? 22 : 4 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        />
      </div>
    </div>
);

export default function GestionView() {
    const { isDarkMode, toggleTheme } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [savingSection, setSavingSection] = useState(null);
    
    const [editMode, setEditMode] = useState({
        horarios: false,
        datos: false,
        turnos: false,
        visual: false
    });

    const [config, setConfig] = useState(null);
    const [tempConfig, setTempConfig] = useState(null);
    const [tempHorarios, setTempHorarios] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        fetch('http://localhost:8080/api/configuracion', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                setConfig(data);
                const parsedH = JSON.parse(data.horariosJson || '[]');
                const initialSchedules = parsedH.length > 0 ? ensureAllDays(parsedH) : getDefaultHorarios();
                setTempHorarios(initialSchedules);
                setTempConfig(data);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const ensureAllDays = (currentH) => {
        const defaultH = getDefaultHorarios();
        return defaultH.map(d => {
            const existing = currentH.find(h => h.dia === d.dia);
            return existing || d;
        });
    };

    const getDefaultHorarios = () => [
        { dia: 'Lunes', desde: '08:00', hasta: '18:00', activo: true },
        { dia: 'Martes', desde: '08:00', hasta: '18:00', activo: true },
        { dia: 'Miércoles', desde: '08:00', hasta: '18:00', activo: true },
        { dia: 'Jueves', desde: '08:00', hasta: '18:00', activo: true },
        { dia: 'Viernes', desde: '08:00', hasta: '16:00', activo: true },
        { dia: 'Sábado', desde: '09:00', hasta: '13:00', activo: false },
        { dia: 'Domingo', desde: '09:00', hasta: '13:00', activo: false },
    ];

    const handleSaveSection = async (section) => {
        setSavingSection(section);
        const token = sessionStorage.getItem('token');
        
        let dataToSave = { ...tempConfig };
        if (section === 'horarios') {
            dataToSave.horariosJson = JSON.stringify(tempHorarios);
        }

        try {
            const res = await fetch('http://localhost:8080/api/configuracion', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSave)
            });
            if (res.ok) {
                const updated = await res.json();
                setConfig(updated);
                setTempConfig(updated);
                const updatedH = JSON.parse(updated.horariosJson || '[]');
                setTempHorarios(ensureAllDays(updatedH));
                setEditMode({ ...editMode, [section]: false });
                toast.success("Cambios guardados");
            } else {
                toast.error("Error al guardar");
            }
        } catch (err) {
            toast.error("Error de conexión");
        } finally {
            setSavingSection(null);
        }
    };

    const handleCancel = (section) => {
        setTempConfig(config);
        if (section === 'horarios') {
            setTempHorarios(ensureAllDays(JSON.parse(config.horariosJson || '[]')));
        }
        setEditMode({ ...editMode, [section]: false });
    };

    const handleLogoClick = () => {
        if (!editMode.visual) return;
        document.getElementById('logoInput').click();
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempConfig({ ...tempConfig, logoUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading || !tempConfig) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin text-4xl text-blue-500 font-black text-[32px]">⟳</div>
        </div>
    );

    const prefs = JSON.parse(tempConfig.preferenciasJson || '{}');

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full space-y-8 pb-10">
            <input type="file" id="logoInput" hidden accept="image/*" onChange={handleLogoChange} />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Gestión de Consultorio</h2>
                    <p className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Personaliza los horarios, datos y estética de tu clínica.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Horarios de Atención */}
                <Card 
                    title="Horarios de Atención" icon={<ClockIcon />} isDarkMode={isDarkMode} 
                    isEditing={editMode.horarios} 
                    onEdit={() => setEditMode({...editMode, horarios: true})}
                    onSave={() => handleSaveSection('horarios')}
                    onCancel={() => handleCancel('horarios')}
                    saving={savingSection === 'horarios'}
                >
                    <div className="space-y-3">
                        {tempHorarios.map((h, i) => (
                            <div key={i} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/30 border-slate-700/50' : 'bg-slate-50 border-slate-100'} ${!h.activo ? 'opacity-50 grayscale' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className={editMode.horarios ? 'cursor-pointer' : 'cursor-default'} onClick={() => {
                                        if (!editMode.horarios) return;
                                        const newH = [...tempHorarios];
                                        newH[i].activo = !newH[i].activo;
                                        setTempHorarios(newH);
                                    }}>
                                        <div className={`w-9 h-5 rounded-full relative transition-colors ${h.activo ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                            <motion.div 
                                                animate={{ x: h.activo ? 18 : 4 }}
                                                className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{h.dia}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TimeInput 
                                        value={h.desde} 
                                        isDarkMode={isDarkMode} 
                                        disabled={!editMode.horarios || !h.activo}
                                        onChange={(v) => {
                                            const newH = [...tempHorarios];
                                            newH[i].desde = v;
                                            setTempHorarios(newH);
                                        }}
                                    />
                                    <span className="text-slate-400 font-bold text-xs">a</span>
                                    <TimeInput 
                                        value={h.hasta} 
                                        isDarkMode={isDarkMode} 
                                        disabled={!editMode.horarios || !h.activo}
                                        onChange={(v) => {
                                            const newH = [...tempHorarios];
                                            newH[i].hasta = v;
                                            setTempHorarios(newH);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Datos de la Clínica */}
                <Card 
                    title="Información de la Clínica" icon={<BuildingIcon />} isDarkMode={isDarkMode} 
                    isEditing={editMode.datos} 
                    onEdit={() => setEditMode({...editMode, datos: true})}
                    onSave={() => handleSaveSection('datos')}
                    onCancel={() => handleCancel('datos')}
                    saving={savingSection === 'datos'}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-full">
                            <InputField label="Nombre de la Institución" value={tempConfig.nombreInstitucion} onChange={(v) => setTempConfig({...tempConfig, nombreInstitucion: v})} isDarkMode={isDarkMode} disabled={!editMode.datos} />
                        </div>
                        <InputField label="Dirección" value={tempConfig.direccion} onChange={(v) => setTempConfig({...tempConfig, direccion: v})} isDarkMode={isDarkMode} disabled={!editMode.datos} />
                        <InputField label="Localidad" value={tempConfig.localidad} onChange={(v) => setTempConfig({...tempConfig, localidad: v})} isDarkMode={isDarkMode} disabled={!editMode.datos} />
                        <InputField label="Teléfono de Contacto" value={tempConfig.telefono} onChange={(v) => setTempConfig({...tempConfig, telefono: v})} isDarkMode={isDarkMode} disabled={!editMode.datos} />
                        <InputField label="Email Corporativo" value={tempConfig.email} onChange={(v) => setTempConfig({...tempConfig, email: v})} isDarkMode={isDarkMode} disabled={!editMode.datos} />
                    </div>
                </Card>

                {/* Configuración de Turnos */}
                <Card 
                    title="Preferencias de Turnos" icon={<BellIcon />} isDarkMode={isDarkMode} 
                    isEditing={editMode.turnos} 
                    onEdit={() => setEditMode({...editMode, turnos: true})}
                    onSave={() => handleSaveSection('turnos')}
                    onCancel={() => handleCancel('turnos')}
                    saving={savingSection === 'turnos'}
                >
                    <div className="space-y-4">
                        {[
                            { id: 'whatsapp', label: 'Notificaciones de WhatsApp automáticas' },
                            { id: 'email', label: 'Recordatorio vía Email (24hs antes)' },
                            { id: 'sobreturnos', label: 'Permitir sobreturnos manuales' }
                        ].map(t => (
                            <Toggle 
                                key={t.id}
                                label={t.label} 
                                enabled={!!prefs[t.id]} 
                                isDarkMode={isDarkMode} 
                                disabled={!editMode.turnos}
                                onClick={() => {
                                    const newPrefs = { ...prefs, [t.id]: !prefs[t.id] };
                                    setTempConfig({ ...tempConfig, preferenciasJson: JSON.stringify(newPrefs) });
                                }}
                            />
                        ))}
                        <div className="pt-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Duración Base por Turno</label>
                             <select 
                                value={prefs.duracion || '30 minutos'}
                                disabled={!editMode.turnos}
                                onChange={(e) => {
                                    const newPrefs = { ...prefs, duracion: e.target.value };
                                    setTempConfig({ ...tempConfig, preferenciasJson: JSON.stringify(newPrefs) });
                                }}
                                className={`w-full mt-1.5 px-4 py-3 rounded-xl border text-sm font-bold outline-none transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'} ${!editMode.turnos ? 'opacity-70 cursor-not-allowed' : ''}`}
                             >
                                <option>15 minutos</option>
                                <option>30 minutos</option>
                                <option>45 minutos</option>
                                <option>60 minutos</option>
                             </select>
                        </div>
                    </div>
                </Card>

                {/* Identidad Visual */}
                <Card 
                    title="Identidad Visual" icon={<PaletteIcon />} isDarkMode={isDarkMode} 
                    isEditing={editMode.visual} 
                    onEdit={() => setEditMode({...editMode, visual: true})}
                    onSave={() => handleSaveSection('visual')}
                    onCancel={() => handleCancel('visual')}
                    saving={savingSection === 'visual'}
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div 
                                onClick={handleLogoClick}
                                className={`w-24 h-24 rounded-3xl border-2 border-dashed flex items-center justify-center text-center p-2 transition-colors overflow-hidden ${isDarkMode ? 'border-slate-700 hover:border-blue-500/50 bg-slate-900/50' : 'border-slate-200 hover:border-blue-400 bg-slate-50'} ${editMode.visual ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
                            >
                                {tempConfig.logoUrl ? (
                                    <img src={tempConfig.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-tight">Cargar Logo</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Logo de la Clínica</h4>
                                <p className="text-xs text-slate-400 font-medium">Recomendado: SVG o PNG transparente de 512x512px.</p>
                                {editMode.visual && (
                                    <button onClick={handleLogoClick} className="mt-3 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">Subir archivo →</button>
                                )}
                            </div>
                        </div>
                        <div className="pt-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Color Principal de la Marca</label>
                            <div className="flex gap-3 mt-3">
                                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                                    <div 
                                        key={color} 
                                        onClick={() => {
                                            if (!editMode.visual) return;
                                            setTempConfig({...tempConfig, colorPrincipal: color});
                                        }}
                                        className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all shadow-sm ${tempConfig.colorPrincipal === color ? 'border-white ring-2 ring-blue-500' : 'border-transparent hover:border-slate-400'} ${!editMode.visual ? 'opacity-50 cursor-default' : ''}`} 
                                        style={{ backgroundColor: color }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}




