 // src/context/DocenteContext.js
import React, { createContext, useContext, useState } from 'react';

const DocenteContext = createContext();

export const useDocente = () => {
  const context = useContext(DocenteContext);
  if (!context) {
    throw new Error('useDocente debe usarse dentro de DocenteProvider');
  }
  return context;
};

export const DocenteProvider = ({ children }) => {
  const [docenteActual, setDocenteActual] = useState(null);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Seleccionar docente actual
  const seleccionarDocente = (docente) => {
    setDocenteActual(docente);
    console.log('Docente seleccionado:', docente);
  };

  // Agregar nuevo docente
  const agregarDocente = (nuevoDocente) => {
    setDocentes(prev => [...prev, nuevoDocente]);
  };

  // Actualizar docente existente
  const actualizarDocente = (id, datosActualizados) => {
    setDocentes(prev => 
      prev.map(docente => 
        docente.id === id ? { ...docente, ...datosActualizados } : docente
      )
    );
    
    // Si el docente actual es el que se está actualizando
    if (docenteActual && docenteActual.id === id) {
      setDocenteActual(prev => ({ ...prev, ...datosActualizados }));
    }
  };

  // Eliminar docente
  const eliminarDocente = (id) => {
    setDocentes(prev => prev.filter(docente => docente.id !== id));
    
    // Si el docente eliminado es el actual, limpiar selección
    if (docenteActual && docenteActual.id === id) {
      setDocenteActual(null);
    }
  };

  // Mostrar notificación simple
  const mostrarNotificacion = (mensaje, tipo = 'info') => {
    // Por ahora usamos alert, después se puede mejorar
    if (tipo === 'error') {
      alert(`❌ Error: ${mensaje}`);
    } else if (tipo === 'success') {
      alert(`✅ Éxito: ${mensaje}`);
    } else {
      alert(`ℹ️ ${mensaje}`);
    }
  };

  const value = {
    // Estado
    docenteActual,
    docentes,
    loading,
    error,
    
    // Setters
    setDocenteActual,
    setDocentes,
    setLoading,
    setError,
    
    // Acciones
    seleccionarDocente,
    agregarDocente,
    actualizarDocente,
    eliminarDocente,
    mostrarNotificacion
  };

  return (
    <DocenteContext.Provider value={value}>
      {children}
    </DocenteContext.Provider>
  );
};
