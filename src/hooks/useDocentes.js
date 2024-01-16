 // src/hooks/useDocentes.js
import { useState, useEffect } from 'react';
import { DocentesService } from '../services/docentesService';
import { useDocente } from '../context/DocenteContext';

export const useDocentes = () => {
  const {
    docentes,
    loading,
    setLoading,
    agregarDocente,
    actualizarDocente,
    eliminarDocente,
    setDocentes,
    mostrarNotificacion
  } = useDocente();

  // Cargar todos los docentes
  const cargarDocentes = async () => {
    setLoading(true);
    
    try {
      const data = await DocentesService.obtenerDocentes();
      setDocentes(data);
      console.log('Docentes cargados:', data);
    } catch (err) {
      console.error('Error al cargar docentes:', err);
      mostrarNotificacion('Error al cargar docentes', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo docente
  const crearDocente = async (datosDocente) => {
    setLoading(true);
    
    try {
      const nuevoDocente = await DocentesService.crearDocente(datosDocente);
      agregarDocente(nuevoDocente);
      mostrarNotificacion('Docente creado exitosamente', 'success');
      return nuevoDocente;
    } catch (err) {
      console.error('Error al crear docente:', err);
      mostrarNotificacion('Error al crear docente', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar docente existente
  const editarDocente = async (id, datosActualizados) => {
    setLoading(true);
    
    try {
      const docenteActualizado = await DocentesService.actualizarDocente(id, datosActualizados);
      actualizarDocente(id, docenteActualizado);
      mostrarNotificacion('Docente actualizado exitosamente', 'success');
      return docenteActualizado;
    } catch (err) {
      console.error('Error al actualizar docente:', err);
      mostrarNotificacion('Error al actualizar docente', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar docente
  const borrarDocente = async (id) => {
    setLoading(true);
    
    try {
      await DocentesService.eliminarDocente(id);
      eliminarDocente(id);
      mostrarNotificacion('Docente eliminado exitosamente', 'success');
    } catch (err) {
      console.error('Error al eliminar docente:', err);
      mostrarNotificacion('Error al eliminar docente', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar docentes al montar el hook
  useEffect(() => {
    if (docentes.length === 0) {
      cargarDocentes();
    }
  }, []);

  return {
    docentes,
    loading,
    cargarDocentes,
    crearDocente,
    editarDocente,
    borrarDocente
  };
};

// Hook para manejo de preferencias
export const usePreferencias = () => {
  const [preferencias, setPreferencias] = useState({
    jornadaPreferida: '',
    sedePreferida: 'Principal',
    tiposAula: [],
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const { mostrarNotificacion } = useDocente();

  const cargarPreferencias = async (docenteId) => {
    if (!docenteId) return;
    
    setLoading(true);
    try {
      const data = await DocentesService.obtenerPreferencias(docenteId);
      setPreferencias(data);
      console.log('Preferencias cargadas:', data);
    } catch (err) {
      console.error('Error al cargar preferencias:', err);
      mostrarNotificacion('Error al cargar preferencias', 'error');
    } finally {
      setLoading(false);
    }
  };

  const guardarPreferencias = async (docenteId, nuevasPreferencias) => {
    if (!docenteId) {
      mostrarNotificacion('Debe seleccionar un docente primero', 'error');
      return false;
    }

    setLoading(true);
    try {
      await DocentesService.guardarPreferencias(docenteId, nuevasPreferencias);
      setPreferencias(nuevasPreferencias);
      mostrarNotificacion('Preferencias guardadas exitosamente', 'success');
      return true;
    } catch (err) {
      console.error('Error al guardar preferencias:', err);
      mostrarNotificacion('Error al guardar preferencias', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    preferencias,
    setPreferencias,
    loading,
    cargarPreferencias,
    guardarPreferencias
  };
};

// Hook para manejo de horarios
export const useHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const { mostrarNotificacion } = useDocente();

  const consultarHorarios = async (filtros = {}) => {
    setLoading(true);
    try {
      const data = await DocentesService.consultarHorarios(filtros);
      setHorarios(data);
      mostrarNotificacion(`Se encontraron ${data.length} horarios`, 'info');
      return data;
    } catch (err) {
      console.error('Error al consultar horarios:', err);
      mostrarNotificacion('Error al consultar horarios', 'error');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const descargarHorarios = async (docenteId, formato = 'PDF') => {
    if (!docenteId) {
      mostrarNotificacion('Debe seleccionar un docente primero', 'error');
      return;
    }

    setLoading(true);
    try {
      await DocentesService.descargarHorarios(docenteId, formato);
      mostrarNotificacion(`Horario descargado en formato ${formato}`, 'success');
    } catch (err) {
      console.error('Error al descargar horarios:', err);
      mostrarNotificacion('Error al descargar horarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    horarios,
    loading,
    consultarHorarios,
    descargarHorarios
  };
};
"// Hook personalizado - Operaciones CRUD y manejo de estado" 
