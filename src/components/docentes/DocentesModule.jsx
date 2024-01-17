import React, { useState } from 'react';
import { User, ChevronDown, Download, Info, Mail, ArrowLeft, Plus, Edit, Search, Bell, X, Clock, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

const mockDocentes = [
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

const mockHorarios = [
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

// Mock de notificaciones
const mockNotificaciones = [
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

const DocentesModule = () => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [showDocenteForm, setShowDocenteForm] = useState(false);
  const [editingDocente, setEditingDocente] = useState(null);
  const [docentes, setDocentes] = useState(mockDocentes);
  const [, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificaciones, setNotificaciones] = useState(mockNotificaciones);
  
  const [filtrosHorarios, setFiltrosHorarios] = useState({
    docenteId: '',
    fecha: '',
    asignatura: '',
    aula: ''
  });

  const [preferencias, setPreferencias] = useState({
    jornadaPreferida: '',
    sedePreferida: 'Principal',
    tiposAula: [],
    observaciones: ''
  });

  const [formData, setFormData] = useState({
    nombre: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    email: '',
    telefono: '',
    departamento: '',
    sedePreferida: 'Principal'
  });

  const tabs = [
    { id: 'gestion', label: 'Gestión Docentes' },
    { id: 'preferencias', label: 'Preferencias' },
    { id: 'notificaciones', label: 'Notificaciones' },
    { id: 'horarios', label: 'Horarios y Asignaciones' }
  ];

  // Funciones utilitarias para notificaciones
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida);
  const cantidadNoLeidas = notificacionesNoLeidas.length;

  const marcarComoLeida = (notificacionId) => {
    setNotificaciones(prev => 
      prev.map(n => n.id === notificacionId ? { ...n, leida: true } : n)
    );
  };

  const eliminarNotificacion = (notificacionId) => {
    setNotificaciones(prev => prev.filter(n => n.id !== notificacionId));
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return '#dc2626';
      case 'media': return '#f59e0b';
      case 'baja': return '#059669';
      default: return '#6b7280';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'asignacion': return <CheckCircle size={16} />;
      case 'cambio_aula': return <AlertCircle size={16} />;
      case 'recordatorio': return <Clock size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const goToWelcome = () => setActiveTab('welcome');

  const resetForm = () => {
    setFormData({
      nombre: '', tipoDocumento: 'CC', numeroDocumento: '', email: '', telefono: '', departamento: '', sedePreferida: 'Principal'
    });
    setEditingDocente(null);
    setShowDocenteForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingDocente) {
        setDocentes(prev => prev.map(d => 
          d.id === editingDocente.id ? { ...formData, id: editingDocente.id, estado: 'activo' } : d
        ));
        alert('Docente actualizado exitosamente');
      } else {
        const nuevoDocente = { ...formData, id: Date.now(), estado: 'activo' };
        setDocentes(prev => [...prev, nuevoDocente]);
        alert('Docente creado exitosamente');
      }
      resetForm();
    } catch (error) {
      alert('Error al procesar docente');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (docente) => {
    setFormData(docente);
    setEditingDocente(docente);
    setShowDocenteForm(true);
  };

  const handleSavePreferencias = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Preferencias guardadas exitosamente');
    } catch (error) {
      alert('Error al guardar preferencias');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = (formato) => {
    alert(`Descarga simulada: horario.${formato.toLowerCase()}`);
  };

  const WelcomeScreen = () => (
    <div className="welcome-container">
      <h2 className="welcome-title">¡Bienvenido/a, Diana Valencia! 👋</h2>
      <div className="welcome-subtitle">
        <span className="welcome-icon">📌</span>
        <span>Este es el módulo de gestión de horarios y aulas para docentes. Desde aquí podrás:</span>
      </div>
      <div className="welcome-list">
        <p><strong>Gestionar información de docentes del sistema.</strong></p>
        <p><strong>Configurar preferencias de jornada y tipo de aula.</strong></p>
        <p><strong>Ver y gestionar tus notificaciones.</strong></p>
        <p><strong>Consultar horarios y ver asignaciones de clase.</strong></p>
        <p><strong>Descargar reportes de horarios en PDF o Excel.</strong></p>
        <p><strong>Selecciona una opción en el menú superior para comenzar.</strong></p>
      </div>
    </div>
  );

  const GestionDocentesScreen = () => (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Gestión de Docentes</h2>
        <button onClick={() => setShowDocenteForm(true)} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Plus size={16} />Nuevo Docente
        </button>
      </div>

      {showDocenteForm && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            {editingDocente ? 'Editar Docente' : 'Nuevo Docente'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Nombre Completo *</label>
              <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Tipo Documento *</label>
              <select value={formData.tipoDocumento} onChange={(e) => setFormData({...formData, tipoDocumento: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} required>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PP">Pasaporte</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Número Documento *</label>
              <input type="text" value={formData.numeroDocumento} onChange={(e) => setFormData({...formData, numeroDocumento: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Email *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Teléfono</label>
              <input type="tel" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Departamento *</label>
              <select value={formData.departamento} onChange={(e) => setFormData({...formData, departamento: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} required>
                <option value="">Seleccionar departamento</option>
                <option value="Ingeniería de Software">Ingeniería de Software</option>
                <option value="Ciencias Básicas">Ciencias Básicas</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Idiomas">Idiomas</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', paddingTop: '16px' }}>
              <button type="submit" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} disabled={loading}>
                {loading ? 'Procesando...' : editingDocente ? 'Actualizar' : 'Crear'}
              </button>
              <button type="button" onClick={resetForm} style={{ backgroundColor: '#6b7280', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {docentes.map(docente => (
          <div key={docente.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{docente.nombre}</h3>
              <span style={{ padding: '2px 8px', fontSize: '12px', borderRadius: '12px', backgroundColor: docente.estado === 'activo' ? '#dcfce7' : '#fee2e2', color: docente.estado === 'activo' ? '#166534' : '#dc2626' }}>
                {docente.estado}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>{docente.departamento}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>{docente.email}</p>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>{docente.tipoDocumento}: {docente.numeroDocumento}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(docente)} style={{ color: '#2563eb', backgroundColor: '#eff6ff', padding: '4px 8px', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Edit size={12} />Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PreferenciasScreen = () => (
    <div className="content-area">
      <div className="preferences-container">
        <div className="preference-section">
          <div className="preference-title">Jornada preferida</div>
          <div className="radio-group">
            {['Mañana (07:00-13:00)', 'Tarde (13:00-18:00)', 'Noche (18:00-21:00)'].map(jornada => (
              <div key={jornada} className="radio-item">
                <input type="radio" name="jornada" value={jornada} checked={preferencias.jornadaPreferida === jornada} onChange={(e) => setPreferencias({...preferencias, jornadaPreferida: e.target.value})} className="radio-input" />
                <span className="radio-label">{jornada}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="preference-section">
          <div className="preference-title">Sede preferida</div>
          <select value={preferencias.sedePreferida} onChange={(e) => setPreferencias({...preferencias, sedePreferida: e.target.value})} className="select-input">
            <option value="Principal">Principal</option>
            <option value="Norte">Norte</option>
            <option value="Sur">Sur</option>
          </select>
        </div>

        <div className="preference-section">
          <div className="preference-title">Tipos de aula preferidos</div>
          <div className="checkbox-grid">
            {['Teórica', 'Laboratorio', 'Aula Híbrida', 'Multimedia'].map(tipo => (
              <div key={tipo} className="checkbox-item">
                <input type="checkbox" checked={preferencias.tiposAula.includes(tipo)} onChange={(e) => {
                  if (e.target.checked) {
                    setPreferencias({...preferencias, tiposAula: [...preferencias.tiposAula, tipo]});
                  } else {
                    setPreferencias({...preferencias, tiposAula: preferencias.tiposAula.filter(t => t !== tipo)});
                  }
                }} className="checkbox-input" />
                <span className="checkbox-label">{tipo}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="preference-section">
          <div className="preference-title">Observaciones</div>
          <textarea value={preferencias.observaciones} onChange={(e) => setPreferencias({...preferencias, observaciones: e.target.value})} className="textarea-input" placeholder="Observaciones adicionales..." maxLength={500} />
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            {preferencias.observaciones.length}/500 caracteres
          </div>
        </div>

        <div className="management-buttons">
          <button onClick={handleSavePreferencias} className="btn-manage" disabled={loading} style={{ cursor: 'pointer' }}>
            {loading ? 'Guardando...' : 'Guardar Preferencias'}
          </button>
        </div>
      </div>
    </div>
  );

  // NUEVA PANTALLA DE NOTIFICACIONES
  const NotificacionesScreen = () => (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Notificaciones
          {cantidadNoLeidas > 0 && (
            <span style={{
              backgroundColor: '#dc2626',
              color: 'white',
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '12px',
              marginLeft: '8px'
            }}>
              {cantidadNoLeidas}
            </span>
          )}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notificaciones.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '40px', 
            borderRadius: '8px', 
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <Bell size={48} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280', margin: 0 }}>No tienes notificaciones</p>
          </div>
        ) : (
          notificaciones.map(notificacion => (
            <div
              key={notificacion.id}
              style={{
                backgroundColor: notificacion.leida ? 'white' : '#f0f9ff',
                border: notificacion.leida ? '1px solid #e5e7eb' : '1px solid #0ea5e9',
                borderRadius: '8px',
                padding: '16px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ 
                  color: getPrioridadColor(notificacion.prioridad),
                  marginTop: '2px'
                }}>
                  {getTipoIcon(notificacion.tipo)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      margin: 0,
                      color: notificacion.leida ? '#374151' : '#1e40af'
                    }}>
                      {notificacion.titulo}
                    </h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!notificacion.leida && (
                        <button
                          onClick={() => marcarComoLeida(notificacion.id)}
                          style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Marcar leída
                        </button>
                      )}
                      <button
                        onClick={() => eliminarNotificacion(notificacion.id)}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: '0 0 8px 0',
                    lineHeight: '1.5'
                  }}>
                    {notificacion.mensaje}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {formatearFecha(notificacion.fechaEnvio)}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: getPrioridadColor(notificacion.prioridad),
                      color: 'white',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}>
                      {notificacion.prioridad}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const HorariosAsignacionesScreen = () => {
    const [mostrarHorario, setMostrarHorario] = useState(false);
    
    // Datos del horario semanal tipo Q10
    const horarioSemanal = {
      'Lunes': [
        { hora: '7:00-8:00', materia: 'SOF Análisis y diseño de sistemas', aula: 'A-101' },
        { hora: '8:00-9:00', materia: 'SOF Análisis y diseño de sistemas', aula: 'A-101' },
        { hora: '9:00-10:00', materia: 'SOF Análisis y diseño de sistemas', aula: 'A-101' }
      ],
      'Martes': [
        { hora: '13:00-14:00', materia: 'SOF Ingeniería de Software II', aula: 'B-205' },
        { hora: '14:00-15:00', materia: 'SOF Ingeniería de Software II', aula: 'B-205' }
      ],
      'Miércoles': [
        { hora: '7:00-8:00', materia: 'SOF Análisis y diseño de sistemas', aula: 'A-101' },
        { hora: '8:00-9:00', materia: 'SOF Análisis y diseño de sistemas', aula: 'A-101' },
        { hora: '9:00-10:00', materia: 'SOF Análisis y diseño de sistemas', aula: 'A-101' },
        { hora: '13:00-14:00', materia: 'SOF Ingeniería de Software II', aula: 'B-205' },
        { hora: '14:00-15:00', materia: 'SOF Ingeniería de Software II', aula: 'B-205' },
        { hora: '15:00-16:00', materia: 'SOF Ingeniería de Software II', aula: 'B-205' }
      ],
      'Jueves': [
        { hora: '7:00-8:00', materia: 'SOF Análisis y diseño de sistemas', aula: 'A-101' },
        { hora: '8:00-9:00', materia: 'SOF Análisis y diseño de sistemas', aula: 'A-101' },
        { hora: '9:00-10:00', materia: 'SOF Análisis y diseño de sistemas', aula: 'A-101' },
        { hora: '15:00-16:00', materia: 'SOF Ingeniería de Software II', aula: 'B-205' },
        { hora: '16:00-17:00', materia: 'SOF Ingeniería de Software II', aula: 'B-205' },
        { hora: '18:00-19:00', materia: 'SOF Metodología de desarrollo II', aula: 'C-301' },
        { hora: '19:00-20:00', materia: 'SOF Metodología de desarrollo II', aula: 'C-301' },
        { hora: '20:00-21:00', materia: 'SOF Metodología de desarrollo II', aula: 'C-301' }
      ],
      'Viernes': [
        { hora: '15:00-16:00', materia: 'SOF Ingeniería de Software II', aula: 'B-205' },
        { hora: '16:00-17:00', materia: 'SOF Ingeniería de Software II', aula: 'B-205' },
        { hora: '18:00-19:00', materia: 'SOF Metodología de desarrollo II', aula: 'C-301' },
        { hora: '19:00-20:00', materia: 'SOF Metodología de desarrollo II', aula: 'C-301' },
        { hora: '20:00-21:00', materia: 'SOF Metodología de desarrollo II', aula: 'C-301' }
      ],
      'Sábado': [
        { hora: '18:00-19:00', materia: 'SOF Metodología de desarrollo II', aula: 'C-301' },
        { hora: '19:00-20:00', materia: 'SOF Metodología de desarrollo II', aula: 'C-301' },
        { hora: '20:00-21:00', materia: 'SOF Metodología de desarrollo II', aula: 'C-301' }
      ]
    };

    const horas = [
      '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm',
      '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm'
    ];

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const handleBuscarHorariosLocal = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMostrarHorario(true);
        alert('Horario cargado exitosamente');
      } catch (error) {
        alert('Error al buscar horarios');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="content-area" style={{ maxWidth: '100%', padding: '20px' }}>
        {/* Layout en dos columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
          
          {/* Columna izquierda - Consulta de Horarios */}
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>Consulta de Horarios</h2>
            
            {/* Filtros */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>Filtros de Búsqueda</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Fecha</label>
                  <input
                    type="date"
                    value={filtrosHorarios.fecha}
                    onChange={(e) => setFiltrosHorarios({...filtrosHorarios, fecha: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Asignatura</label>
                  <input
                    type="text"
                    value={filtrosHorarios.asignatura}
                    onChange={(e) => setFiltrosHorarios({...filtrosHorarios, asignatura: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    placeholder="Nombre de asignatura"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Aula</label>
                  <input
                    type="text"
                    value={filtrosHorarios.aula}
                    onChange={(e) => setFiltrosHorarios({...filtrosHorarios, aula: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    placeholder="Código de aula"
                  />
                </div>
              </div>
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  onClick={handleBuscarHorariosLocal}
                  style={{ 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: '6px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  disabled={loading}
                >
                  <Search size={16} />
                  {loading ? 'Buscando...' : 'Buscar Horarios'}
                </button>
              </div>
            </div>

            {/* Horario Semanal tipo Q10 - Solo se muestra después de buscar */}
            {mostrarHorario && (
              <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: 0 }}>
                    Horario Semanal - Diana Valencia
                  </h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Día
                    </button>
                    <button style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Semana
                    </button>
                    <button style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Mes
                    </button>
                  </div>
                </div>
                
                {/* Calendario estilo Q10 */}
                <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9' }}>
                        <th style={{ padding: '6px', border: '1px solid #e2e8f0', fontSize: '10px', fontWeight: '600', width: '60px' }}>Hora</th>
                        {dias.map(dia => (
                          <th key={dia} style={{ 
                            padding: '6px', 
                            border: '1px solid #e2e8f0', 
                            fontSize: '10px', 
                            fontWeight: '600',
                            minWidth: '80px',
                            backgroundColor: dia === 'Domingo' ? '#f8fafc' : '#f1f5f9'
                          }}>
                            {dia.substring(0, 3)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {horas.map(hora => (
                        <tr key={hora}>
                          <td style={{ 
                            padding: '3px 6px', 
                            border: '1px solid #e2e8f0', 
                            fontSize: '9px', 
                            fontWeight: '500',
                            backgroundColor: '#f8fafc',
                            textAlign: 'center'
                          }}>
                            {hora}
                          </td>
                          {dias.map(dia => {
                            const clases = horarioSemanal[dia] || [];
                            const claseEnEstaHora = clases.find(clase => 
                              clase.hora.includes(hora.replace('am', '').replace('pm', '').padStart(2, '0'))
                            );
                            
                            return (
                              <td key={`${dia}-${hora}`} style={{ 
                                padding: '1px', 
                                border: '1px solid #e2e8f0',
                                height: '30px',
                                backgroundColor: dia === 'Domingo' ? '#f9fafb' : 'white'
                              }}>
                                {claseEnEstaHora && (
                                  <div style={{
                                    backgroundColor: '#4f46e5',
                                    color: 'white',
                                    padding: '2px 4px',
                                    borderRadius: '3px',
                                    fontSize: '8px',
                                    lineHeight: '1.1',
                                    margin: '1px'
                                  }}>
                                    <div style={{ fontWeight: '600' }}>{claseEnEstaHora.materia.substring(0, 20)}...</div>
                                    <div style={{ opacity: 0.8 }}>{claseEnEstaHora.aula}</div>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Asignaciones */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Asignaciones de Clase</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleDescargar('PDF')}
                  style={{ 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    padding: '6px 12px', 
                    border: 'none', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <Download size={14} />
                  Descargar PDF
                </button>
                <button
                  onClick={() => handleDescargar('Excel')}
                  style={{ 
                    backgroundColor: '#6b7280', 
                    color: 'white', 
                    padding: '6px 12px', 
                    border: 'none', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <Download size={14} />
                  Descargar Excel
                </button>
              </div>
            </div>

            {/* Asignaciones estilo mockup */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Estas asignaciones fueron generadas automáticamente y se basan en tu disponibilidad, preferencias y restricciones registradas.
                </p>
              </div>
              
              <div style={{ padding: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb', fontSize: '12px' }}>Asignatura</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb', fontSize: '12px' }}>Área Académica</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb', fontSize: '12px' }}>Día</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb', fontSize: '12px' }}>Hora</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb', fontSize: '12px' }}>Aula</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '2px solid #e5e7eb', fontSize: '12px' }}>Detalles del Aula</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', color: '#374151', fontWeight: '500', fontSize: '12px' }}>Programación I</td>
                      <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '12px' }}>Ingeniería de Software</td>
                      <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '12px' }}>Lunes</td>
                      <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '12px' }}>08:00-10:00</td>
                      <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '12px' }}>A-101</td>
                      <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '12px' }}>Teórica, 40 puestos TV</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', color: '#374151', fontWeight: '500', fontSize: '12px' }}>Cálculo Integral</td>
                      <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '12px' }}>Ciencias Básicas</td>
                      <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '12px' }}>Miércoles</td>
                      <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '12px' }}>13:00-15:00</td>
                      <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '12px' }}>L-202</td>
                      <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '12px' }}>Laboratorio, 30 PCs aire, dste</td>
                    </tr>
                  </tbody>
                </table>

                {/* Botones de acción estilo mockup */}
                <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button style={{ 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    padding: '6px 12px', 
                    border: 'none', 
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Info size={12} />
                    Ver detalle
                  </button>
                  <button style={{ 
                    backgroundColor: '#059669', 
                    color: 'white', 
                    padding: '6px 12px', 
                    border: 'none', 
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Mail size={12} />
                    Solicitar cambio de aula
                  </button>
                  <button style={{ 
                    backgroundColor: '#dc2626', 
                    color: 'white', 
                    padding: '6px 12px', 
                    border: 'none', 
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Download size={12} />
                    Descargar asignaciones (PDF)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'welcome': return <WelcomeScreen />;
      case 'gestion': return <GestionDocentesScreen />;
      case 'preferencias': return <PreferenciasScreen />;
      case 'notificaciones': return <NotificacionesScreen />;
      case 'horarios': return <HorariosAsignacionesScreen />;
      default: return <WelcomeScreen />;
    }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f5f5f5'}}>
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-container">
              <img 
                src="/logoU.png"
                alt="Universidad Von Humboldt Logo" 
                className="logo-image"
              />
            </div>
            <div className="university-text">
              <div className="university-name">Corporación Empresarial</div>
              <div className="university-subtitle">Universitaria Von Humboldt</div>
            </div>
          </div>
          
          <div className="app-title">Gestión de horarios y aulas - Docentes</div>
          
          <div className="user-info">
            <User size={18} />
            <div>
              <div className="user-name">Diana Valencia</div>
              <div className="user-role">Administrador</div>
            </div>
            <ChevronDown size={16} />
            {/* Indicador de notificaciones */}
            {cantidadNoLeidas > 0 && (
              <div style={{
                position: 'relative',
                marginLeft: '8px'
              }}>
                <Bell size={18} style={{ color: '#f59e0b' }} />
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {cantidadNoLeidas > 9 ? '9+' : cantidadNoLeidas}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="nav-header">
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              {tab.label}
              {/* Badge de notificaciones en la pestaña */}
              {tab.id === 'notificaciones' && cantidadNoLeidas > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {cantidadNoLeidas > 9 ? '9+' : cantidadNoLeidas}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="main-container">
        {activeTab !== 'welcome' && (
          <div className="content-header">
            <ArrowLeft className="back-arrow" size={24} onClick={goToWelcome} style={{ cursor: 'pointer', color: '#374151' }} />
            <span className="content-title">Gestión de horario y aulas para docentes</span>
          </div>
        )}
        
        {renderContent()}
      </div>

      <footer className="footer">
        <p>Corporación Empresarial Universitaria Von Humboldt</p>
      </footer>
    </div>
  );
};

export default DocentesModule;"// Sistema de notificaciones integrado - badges y alertas" 
