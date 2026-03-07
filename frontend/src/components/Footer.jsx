import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-6 text-center border-t border-slate-200/50 dark:border-slate-800">
      <div className="text-xs font-medium text-slate-400 dark:text-slate-500 space-y-1 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center items-center">
        <span>Empresa MediCore</span>
        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
        <span>Soporte: medicore.soporte@gmail.com</span>
        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
        <span>WhatsApp: +54 9 11 5555-5555 (Arg)</span>
      </div>
    </footer>
  );
};

export default Footer;