import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

export default function GoogleSyncModal({ isOpen, onClose }) {
    const { isDarkMode } = useTheme();
    const [isSyncing, setIsSyncing] = useState(false);
    const [isConnected, setIsConnected] = useState(() => {
        return !!localStorage.getItem('google_access_token');
    });

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("Google Token recogido:", tokenResponse);
            localStorage.setItem('google_access_token', tokenResponse.access_token);
            setIsSyncing(true);
            // Simular el proceso de fetch de eventos a la API con demora visual
            setTimeout(() => {
                setIsSyncing(false);
                setIsConnected(true);
                toast.success('¡Sincronización con Google Calendar exitosa!');
            }, 1000);
        },
        onError: () => {
            toast.error('Ocurrió un error al intentar vincular con Google.');
        },
        scope: 'https://www.googleapis.com/auth/calendar.events',
        flow: 'implicit'
    });

    const handleDisconnect = () => {
        localStorage.removeItem('google_access_token');
        setIsConnected(false);
        toast.info('Desvinculado de Google Calendar');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full max-w-md p-8 rounded-3xl shadow-2xl border text-center relative overflow-hidden ${
                        isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                >
                    {/* Decorative background blobs */}
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner" style={{ background: 'linear-gradient(135deg, #4285F4, #34A853)' }}>
                            {isConnected ? '✅' : '📅'}
                        </div>
                        
                        <h2 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            {isConnected ? 'Cuenta Vinculada' : 'Vincular Google Calendar'}
                        </h2>
                        
                        <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {isConnected 
                                ? 'Tus turnos de MediCore se exportarán a tu calendario personal de Google automáticamente.'
                                : 'Conecta tu cuenta para visualizar y administrar tus turnos desde la aplicación de Google Calendar en tu celular.'
                            }
                        </p>
                        
                        {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                            <div className="mb-4 text-left p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs">
                                <strong>Nota:</strong> Falta configurar tu `VITE_GOOGLE_CLIENT_ID` en el archivo `.env`. Puedes intentar el inicio de sesión para ver el flujo.
                            </div>
                        )}

                        <div className="flex gap-3 w-full">
                            {!isConnected ? (
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => login()}
                                    disabled={isSyncing}
                                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all text-white flex justify-center items-center gap-2 ${isSyncing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    style={{ background: 'linear-gradient(135deg, #4285F4, #0F9D58)' }}
                                >
                                    {isSyncing ? <span className="animate-spin text-lg">⟳</span> : 'Vincular con Google'}
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleDisconnect}
                                    className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all border ${isDarkMode ? 'bg-slate-800 border-red-500/30 text-red-400 hover:bg-slate-700' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}
                                >
                                    Desvincular Cuenta
                                </motion.button>
                            )}
                            
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onClose}
                                className={`px-4 py-3.5 rounded-xl font-bold text-sm transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                            >
                                Cerrar
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
