 import { useState, useEffect } from 'react';
import { NotificacionesService } from '../services/notificacionesService';

export const useNotificaciones = (docenteId) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar notificaciones
  const cargarNotificaciones = async () => {
    if (!docenteId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await NotificacionesService.obtenerNotificaciones(docenteId);
      setNotificaciones(data);
      
      const noLeidasData = data.filter(n => !n.leida);
      setNoLeidas(noLeidasData);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  // Marcar como leída
  const marcarComoLeida = async (notificacionId) => {
    try {
      await NotificacionesService.marcarComoLeida(notificacionId);
      setNotificaciones(prev => 
        prev.map(n => n.id === notificacionId ? { ...n, leida: true } : n)
      );
      setNoLeidas(prev => prev.filter(n => n.id !== notificacionId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar notificación
  const eliminarNotificacion = async (notificacionId) => {
    try {
      await NotificacionesService.eliminarNotificacion(notificacionId);
      setNotificaciones(prev => prev.filter(n => n.id !== notificacionId));
      setNoLeidas(prev => prev.filter(n => n.id !== notificacionId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Enviar nueva notificación
  const enviarNotificacion = async (notificacionData) => {
    try {
      const nueva = await NotificacionesService.enviarNotificacion(notificacionData);
      setNotificaciones(prev => [nueva, ...prev]);
      if (!nueva.leida) {
        setNoLeidas(prev => [nueva, ...prev]);
      }
      return nueva;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, [docenteId]);

  return {
    notificaciones,
    noLeidas,
    cantidadNoLeidas: noLeidas.length,
    loading,
    error,
    cargarNotificaciones,
    marcarComoLeida,
    eliminarNotificacion,
    enviarNotificacion
  };
};
