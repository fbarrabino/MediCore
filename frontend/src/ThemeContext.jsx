import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Cargar preferencia del backend al iniciar si hay token
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch('http://localhost:8080/api/configuracion', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.themePreference) {
          setIsDarkMode(data.themePreference === 'dark');
        }
      })
      .catch(err => console.error("Error cargando tema del backend:", err));
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Opcional: Guardar inmediatamente en el backend si hay sesión
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        // Obtenemos la config actual primero para no sobreescribir otros datos si no estamos en GestionView
        const res = await fetch('http://localhost:8080/api/configuracion', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const currentConfig = await res.json();
        
        await fetch('http://localhost:8080/api/configuracion', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...currentConfig,
            themePreference: newMode ? 'dark' : 'light'
          })
        });
      } catch (e) {
        console.error("Error guardando tema en BD:", e);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};