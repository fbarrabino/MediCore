import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", type = "danger" }) {
    const { isDarkMode } = useTheme();

    if (!isOpen) return null;

    const accentColor = type === 'danger' ? 'from-red-600 to-rose-600' : 'from-blue-600 to-indigo-600';
    const icon = type === 'danger' ? '⚠️' : '❓';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full max-w-sm rounded-3xl shadow-2xl border overflow-hidden ${
                        isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                >
                    <div className={`p-6 text-center`}>
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mx-auto mb-4">
                            {icon}
                        </div>
                        <h3 className={`text-xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            {title}
                        </h3>
                        <p className={`text-sm mb-8 px-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {message}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                                    isDarkMode 
                                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500' 
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {cancelText}
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { onConfirm(); onClose(); }}
                                className={`flex-1 py-3 rounded-xl font-black text-sm text-white shadow-lg bg-gradient-to-r ${accentColor}`}
                            >
                                {confirmText}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
