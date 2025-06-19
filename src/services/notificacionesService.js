 import ApiService from './api';

export class NotificacionesService {
  // Datos mock como respaldo
  static mockNotificaciones = [
    {
      id: 1,
      docenteId: 1,
      tipo: 'asignacion',
      titulo: 'Nueva asignación de clase',
      mensaje: 'Se te ha asignado la materia "Programación Web" para el día Lunes de 8:00-10:00 en el aula A-201',
      fechaEnvio: '2024-06-15T10:30:00Z',
      leida: false,
      prioridad: 'alta'
    },
    {
      id: 2,
      docenteId: 1,
      tipo: 'cambio_aula',
      titulo: 'Cambio de aula',
      mensaje: 'Tu clase de "Cálculo I" del Miércoles ha sido trasladada del aula L-202 al aula B-105',
      fechaEnvio: '2024-06-14T14:15:00Z',
      leida: true,
      prioridad: 'media'
    },
    {
      id: 3,
      docenteId: 1,
      tipo: 'recordatorio',
      titulo: 'Recordatorio: Actualizar disponibilidad',
      mensaje: 'Recuerda actualizar tu disponibilidad horaria para el próximo semestre',
      fechaEnvio: '2024-06-13T09:00:00Z',
      leida: false,
      prioridad: 'baja'
    }
  ];

  static USE_BACKEND = false;

  // Obtener notificaciones de un docente
  static async obtenerNotificaciones(docenteId) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - notificaciones');
      return Promise.resolve(this.mockNotificaciones.filter(n => n.docenteId === docenteId));
    }

    try {
      console.log('🌐 Obteniendo notificaciones del backend...');
      const response = await ApiService.get(`/notificaciones/docente/${docenteId}`);
      console.log('✅ Notificaciones obtenidas del backend');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      return this.mockNotificaciones.filter(n => n.docenteId === docenteId);
    }
  }

  // Marcar notificación como leída
  static async marcarComoLeida(notificacionId) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - marcar como leída');
      const notificacion = this.mockNotificaciones.find(n => n.id === notificacionId);
      if (notificacion) {
        notificacion.leida = true;
      }
      return Promise.resolve({ success: true });
    }

    try {
      console.log('🌐 Marcando notificación como leída en backend...');
      const response = await ApiService.put(`/notificaciones/${notificacionId}/leida`);
      console.log('✅ Notificación marcada como leída');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      return { success: true };
    }
  }

  // Enviar nueva notificación
  static async enviarNotificacion(notificacionData) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - enviar notificación');
      const nuevaNotificacion = {
        id: Date.now(),
        ...notificacionData,
        fechaEnvio: new Date().toISOString(),
        leida: false
      };
      this.mockNotificaciones.unshift(nuevaNotificacion);
      return Promise.resolve(nuevaNotificacion);
    }

    try {
      console.log('🌐 Enviando notificación al backend...');
      const response = await ApiService.post('/notificaciones', {
        docenteId: notificacionData.docenteId,
        tipo: notificacionData.tipo,
        titulo: notificacionData.titulo,
        mensaje: notificacionData.mensaje,
        prioridad: notificacionData.prioridad || 'media',
        fechaEnvio: new Date().toISOString()
      });
      console.log('✅ Notificación enviada al backend');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      const nuevaNotificacion = {
        id: Date.now(),
        ...notificacionData,
        fechaEnvio: new Date().toISOString(),
        leida: false
      };
      return nuevaNotificacion;
    }
  }

  // Eliminar notificación
  static async eliminarNotificacion(notificacionId) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - eliminar notificación');
      this.mockNotificaciones = this.mockNotificaciones.filter(n => n.id !== notificacionId);
      return Promise.resolve({ success: true });
    }

    try {
      console.log('🌐 Eliminando notificación del backend...');
      const response = await ApiService.delete(`/notificaciones/${notificacionId}`);
      console.log('✅ Notificación eliminada del backend');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      return { success: true };
    }
  }

  // Obtener notificaciones no leídas
  static async obtenerNoLeidas(docenteId) {
    const notificaciones = await this.obtenerNotificaciones(docenteId);
    return notificaciones.filter(n => !n.leida);
  }

  static toggleBackendMode(useBackend = true) {
    this.USE_BACKEND = useBackend;
    console.log(`🔄 Notificaciones - Modo cambiado: ${useBackend ? 'BACKEND' : 'MOCK'}`);
  }
}
"// Notificaciones Service - Gesti�n de alertas y mensajes del sistema" 
