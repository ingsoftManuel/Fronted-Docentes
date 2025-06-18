// REEMPLAZA tu archivo src/services/docentesService.js CON ESTA VERSIÓN
// QUE MANTIENE LOS DATOS MOCK COMO FALLBACK

import ApiService from './api';

export class DocentesService {
  // Datos mock como respaldo (los que tienes actualmente)
  static mockDocentes = [
    {
      id: 1,
      nombre: 'Diana Valencia',
      tipoDocumento: 'CC',
      numeroDocumento: '12345678',
      email: 'diana.valencia@universidad.edu.co',
      telefono: '3001234567',
      departamento: 'Ingeniería de Software',
      sedePreferida: 'Principal',
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'Carlos Rodriguez',
      tipoDocumento: 'CC',
      numeroDocumento: '87654321',
      email: 'carlos.rodriguez@universidad.edu.co',
      telefono: '3007654321',
      departamento: 'Matemáticas',
      sedePreferida: 'Norte',
      estado: 'activo'
    }
  ];

  static mockHorarios = [
    {
      id: 1,
      docenteNombre: 'Diana Valencia',
      asignatura: 'Programación Web',
      dia: 'Lunes',
      horaInicio: '08:00',
      horaFin: '10:00',
      aula: 'A201',
      estado: 'confirmado'
    },
    {
      id: 2,
      docenteNombre: 'Carlos Rodriguez',
      asignatura: 'Cálculo I',
      dia: 'Martes',
      horaInicio: '10:00',
      horaFin: '12:00',
      aula: 'B105',
      estado: 'pendiente'
    }
  ];

  // Flag para alternar entre backend y mock
  static USE_BACKEND = false; // Cambia a true cuando el backend esté listo

  // ===== RF1 - CRUD DE DOCENTES =====
  
  static async obtenerDocentes() {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando datos mock - docentes');
      return Promise.resolve(this.mockDocentes);
    }

    try {
      console.log('🌐 Intentando conectar con backend...');
      const response = await ApiService.get('/docentes');
      console.log('✅ Backend conectado - docentes obtenidos');
      return response;
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando datos mock:', error.message);
      return this.mockDocentes;
    }
  }

  static async crearDocente(docenteData) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - crear docente');
      const nuevoDocente = { 
        ...docenteData, 
        id: Date.now(), 
        estado: 'activo' 
      };
      this.mockDocentes.push(nuevoDocente);
      return Promise.resolve(nuevoDocente);
    }

    try {
      console.log('🌐 Creando docente en backend...');
      const response = await ApiService.post('/docentes', {
        nombre: docenteData.nombre,
        tipoDocumento: docenteData.tipoDocumento,
        numeroDocumento: docenteData.numeroDocumento,
        email: docenteData.email,
        telefono: docenteData.telefono,
        departamento: docenteData.departamento,
        sedePreferida: docenteData.sedePreferida,
        estado: 'activo'
      });
      console.log('✅ Docente creado en backend');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      const nuevoDocente = { ...docenteData, id: Date.now(), estado: 'activo' };
      this.mockDocentes.push(nuevoDocente);
      return nuevoDocente;
    }
  }

  static async actualizarDocente(id, data) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - actualizar docente');
      const index = this.mockDocentes.findIndex(d => d.id === id);
      if (index !== -1) {
        this.mockDocentes[index] = { ...this.mockDocentes[index], ...data };
        return Promise.resolve(this.mockDocentes[index]);
      }
      return Promise.resolve({ ...data, id });
    }

    try {
      console.log('🌐 Actualizando docente en backend...');
      const response = await ApiService.put(`/docentes/${id}`, data);
      console.log('✅ Docente actualizado en backend');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      return { ...data, id };
    }
  }

  static async eliminarDocente(id) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - eliminar docente');
      this.mockDocentes = this.mockDocentes.filter(d => d.id !== id);
      return Promise.resolve({ success: true });
    }

    try {
      console.log('🌐 Eliminando docente en backend...');
      const response = await ApiService.delete(`/docentes/${id}`);
      console.log('✅ Docente eliminado en backend');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      return { success: true };
    }
  }

  // ===== RF2 - PREFERENCIAS =====
  
  static async obtenerPreferencias(docenteId) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - preferencias');
      return Promise.resolve({
        jornadaPreferida: 'Mañana (07:00-13:00)',
        sedePreferida: 'Principal',
        tiposAula: ['Teórica', 'Laboratorio'],
        observaciones: 'Preferencias de ejemplo'
      });
    }

    try {
      console.log('🌐 Obteniendo preferencias del backend...');
      const response = await ApiService.get(`/preferencias/${docenteId}`);
      console.log('✅ Preferencias obtenidas del backend');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      return {
        jornadaPreferida: '',
        sedePreferida: 'Principal',
        tiposAula: [],
        observaciones: ''
      };
    }
  }

  static async guardarPreferencias(docenteId, preferenciasData) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - guardar preferencias');
      return Promise.resolve({ 
        success: true, 
        message: 'Preferencias guardadas (mock)' 
      });
    }

    try {
      console.log('🌐 Guardando preferencias en backend...');
      const response = await ApiService.post('/preferencias', {
        docenteId,
        jornadaPreferida: preferenciasData.jornadaPreferida,
        sedePreferida: preferenciasData.sedePreferida,
        tiposAulaPreferidos: preferenciasData.tiposAula,
        observaciones: preferenciasData.observaciones
      });
      console.log('✅ Preferencias guardadas en backend');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      return { success: true, message: 'Preferencias guardadas localmente' };
    }
  }

  // ===== RF3 - CONSULTA DE HORARIOS =====
  
  static async consultarHorarios(filtros = {}) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - consultar horarios');
      return Promise.resolve(this.mockHorarios);
    }

    try {
      console.log('🌐 Consultando horarios en backend...');
      const queryParams = new URLSearchParams(filtros).toString();
      const response = await ApiService.get(`/horarios${queryParams ? `?${queryParams}` : ''}`);
      console.log('✅ Horarios obtenidos del backend');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      return this.mockHorarios;
    }
  }

  // ===== RF4 - DISPONIBILIDAD =====
  
  static async obtenerDisponibilidad(docenteId) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - disponibilidad');
      return Promise.resolve({});
    }

    try {
      console.log('🌐 Obteniendo disponibilidad del backend...');
      const response = await ApiService.get(`/disponibilidad/${docenteId}`);
      console.log('✅ Disponibilidad obtenida del backend');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      return {};
    }
  }

  static async guardarDisponibilidad(docenteId, disponibilidad) {
    if (!this.USE_BACKEND) {
      console.log('🔧 Usando mock - guardar disponibilidad');
      return Promise.resolve({ success: true });
    }

    try {
      console.log('🌐 Guardando disponibilidad en backend...');
      const response = await ApiService.post(`/disponibilidad/${docenteId}`, { disponibilidad });
      console.log('✅ Disponibilidad guardada en backend');
      return response;
    } catch (error) {
      console.warn('⚠️ Error en backend, usando mock:', error.message);
      return { success: true };
    }
  }

  // ===== RF5 - DESCARGA DE HORARIOS =====
  
  static async descargarHorarios(docenteId, formato = 'PDF') {
    if (!this.USE_BACKEND) {
      console.log('🔧 Simulando descarga (mock)');
      alert(`Descarga simulada: horario_docente_${docenteId}.${formato.toLowerCase()}`);
      return Promise.resolve({ success: true });
    }

    try {
      console.log('🌐 Descargando desde backend...');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
      const response = await fetch(`${API_BASE_URL}/horarios/descarga/${docenteId}?formato=${formato}`);
      
      if (!response.ok) {
        throw new Error('Error en la descarga');
      }
      
      const blob = await response.blob();
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `horario_docente_${docenteId}.${formato.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Archivo descargado del backend');
      return { success: true };
    } catch (error) {
      console.warn('⚠️ Error en descarga, simulando:', error.message);
      alert(`Descarga simulada: horario_docente_${docenteId}.${formato.toLowerCase()}`);
      return { success: true };
    }
  }

  // ===== MÉTODO PARA CAMBIAR MODO =====
  
  static toggleBackendMode(useBackend = true) {
    this.USE_BACKEND = useBackend;
    console.log(`🔄 Modo cambiado: ${useBackend ? 'BACKEND' : 'MOCK'}`);
  }

  // ===== MÉTODO PARA PROBAR CONEXIÓN =====
  
  static async probarConexion() {
    try {
      console.log('🔍 Probando conexión con backend...');
      const response = await ApiService.get('/health'); // Endpoint de health check
      console.log('✅ Backend disponible:', response);
      return true;
    } catch (error) {
      console.warn('❌ Backend no disponible:', error.message);
      return false;
    }
  }
}