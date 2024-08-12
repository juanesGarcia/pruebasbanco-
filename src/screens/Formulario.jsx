import React, { useState } from 'react';
import './App.css'

function Formulario() {
  const [formData, setFormData] = useState({
    nombre: '',
    carrera: '',
    calificacionPsicotecnica: '',
    calificacionLogica: '',
    calificacionEntrevistaPersonal: '',
    calificacionEntrevistaJefe: ''
  });

  const [estudiantes, setEstudiantes] = useState([
    { nombre: "Juan Perez", carrera: "Ingenieria Informatica", estadoSeleccion: "En proceso", calificacionPsicotecnica: null, calificacionLogica: null, calificacionEntrevistaPersonal: null, calificacionEntrevistaJefe: null, calificacionesEnviadas: [] },
    { nombre: "Maria Gutierrez", carrera: "Ingenieria Informatica", estadoSeleccion: "En proceso", calificacionPsicotecnica: null, calificacionLogica: null, calificacionEntrevistaPersonal: null, calificacionEntrevistaJefe: null, calificacionesEnviadas: [] },
    { nombre: "Carlos Martinez", carrera: "Ingenieria Informatica", estadoSeleccion: "En proceso", calificacionPsicotecnica: null, calificacionLogica: null, calificacionEntrevistaPersonal: null, calificacionEntrevistaJefe: null, calificacionesEnviadas: [] },
    // Resto de estudiantes aquí...
  ]);

  const [estudianteEncontrado, setEstudianteEncontrado] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Buscar estudiante cuyo nombre y carrera coinciden con formData
    const estudianteCoincidente = estudiantes.find(estudiante =>
      estudiante.nombre.toLowerCase() === formData.nombre.toLowerCase() &&
      estudiante.carrera.toLowerCase() === formData.carrera.toLowerCase()
    );
    if (estudianteCoincidente) {
      setEstudianteEncontrado(estudianteCoincidente);
      setNoEncontrado(false);
    } else {
      setEstudianteEncontrado(null);
      setNoEncontrado(true);
    }
  };

  const handleGuardarCalificaciones = (tipoPrueba) => {
    const calificacion = parseFloat(formData[`calificacion${tipoPrueba.charAt(0).toUpperCase() + tipoPrueba.slice(1)}`]);
    const estudiantesActualizados = estudiantes.map(estudiante => {
      if (
        estudiante.nombre.toLowerCase() === formData.nombre.toLowerCase() &&
        estudiante.carrera.toLowerCase() === formData.carrera.toLowerCase()
      ) {
        const nuevasCalificaciones = [...estudiante.calificacionesEnviadas, tipoPrueba.toLowerCase()];
        const promedio = calcularPromedio(calificacion, nuevasCalificaciones.length, estudiante);
        const estadoSeleccion = calificacion >= 6 ? 'En proceso' : 'Inactivo'; // Se cambia a 'Inactivo' si la calificación es menor a 6
        return {
          ...estudiante,
          [`calificacion${tipoPrueba.charAt(0).toUpperCase() + tipoPrueba.slice(1)}`]: calificacion,
          calificacionesEnviadas: nuevasCalificaciones,
          promedio: promedio,
          estadoSeleccion: estadoSeleccion // Se actualiza el estado de selección
        };
      }
      return estudiante;
    });

    setEstudiantes(estudiantesActualizados);
    setFormData({
      ...formData,
      [tipoPrueba]: ''
    });
    setEstudianteEncontrado(null);
    setNoEncontrado(false);
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit} className='form'>
        <h1 className='par'>buscar por estudiante y carrera</h1>
        <div className='nombre-cont'>
           
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div className='car-cont'>
          <label htmlFor="carrera">Carrera:</label>
          <input
            type="text"
            id="carrera"
            name="carrera"
            value={formData.carrera}
            onChange={handleChange}
          />
        </div>
        <div class="button-borders">
  <button class="primary-button"> Buscar
  </button>
</div>
       
        {noEncontrado && <p>No se encontró ningún estudiante.</p>}
        {estudianteEncontrado && (
          <div>
            <h2>Estudiante encontrado:</h2>
            <p>
              <strong>Nombre:</strong> {estudianteEncontrado.nombre}<br />
              <strong>Carrera:</strong> {estudianteEncontrado.carrera}<br />
              <strong>Estado de selección:</strong> {estudianteEncontrado.estadoSeleccion === 'Inactivo' ? 'Inactivo' : 'En proceso'}<br />
            </p>
          </div>
        )}
    
        {estudianteEncontrado && estudianteEncontrado.estadoSeleccion === 'Inactivo' && (
          <p>Este estudiante ya no está en proceso de selección.</p>
        )}

        {estudianteEncontrado && estudianteEncontrado.estadoSeleccion !== 'Inactivo' && (
          <div>
            {estudianteEncontrado.calificacionesEnviadas.includes('psicotecnica') ? (
              <p>Calificación Psicotécnica: {estudianteEncontrado.calificacionPsicotecnica}</p>
            ) : (
              <div>
                <label htmlFor="calificacionPsicotecnica">Calificación Psicotécnica:</label>
                <input
                  type="number"
                  id="calificacionPsicotecnica"
                  name="calificacionPsicotecnica"
                  min="1"
                  max="10"
                  value={formData.calificacionPsicotecnica}
                  onChange={handleChange}
                />
                <button type="button" onClick={() => handleGuardarCalificaciones('psicotecnica')}>Guardar Psicotécnica</button>
              </div>
            )}

            {estudianteEncontrado.calificacionesEnviadas.includes('logica') ? (
              <p>Calificación de Lógica: {estudianteEncontrado.calificacionLogica}</p>
            ) : (
              <div>
                <label htmlFor="calificacionLogica">Calificación de Lógica:</label>
                <input
                  type="number"
                  id="calificacionLogica"
                  name="calificacionLogica"
                  min="1"
                  max="10"
                  value={formData.calificacionLogica}
                  onChange={handleChange}
                />
                <button type="button" onClick={() => handleGuardarCalificaciones('logica')}>Guardar Lógica</button>
              </div>
            )}

          </div>
        )}
      </form>
      {estudiantes.filter(estudiante =>
        estudiante.carrera.toLowerCase() === formData.carrera.toLowerCase() &&
        estudiante.calificacionesEnviadas.length > 0 &&
        estudiante.estadoSeleccion !== 'Inactivo' // Solo estudiantes en proceso pueden ser ganadores
      ).map(estudiante => (
        <div key={estudiante.nombre} className='estudiante'>
          <h2>{estudiante.nombre}</h2>
          <p>Carrera: {estudiante.carrera}</p>
          <p>Estado de selección: {estudiante.estadoSeleccion}</p>
          <p>Calificaciones:</p>
          {estudiante.calificacionesEnviadas.map(calificacion => (
            <p key={calificacion}>
              {calificacion.charAt(0).toUpperCase() + calificacion.slice(1)}: {estudiante[`calificacion${calificacion.charAt(0).toUpperCase() + calificacion.slice(1)}`]}
            </p>
          ))}
    
          <p>Promedio: {estudiante.promedio}</p>
        </div>
      ))}
      {mostrarGanador(formData.carrera, estudiantes)}
    </div>
  );
}

function calcularPromedio(calificacion, numCalificaciones, estudiante) {
  const sumatoria = estudiante.calificacionesEnviadas.reduce((total, calificacion) => {
    return total + estudiante[`calificacion${calificacion.charAt(0).toUpperCase() + calificacion.slice(1)}`];
  }, calificacion);
  return (sumatoria / numCalificaciones).toFixed(2);
}

function mostrarGanador(carrera, estudiantes) {
  const estudiantesCarrera = estudiantes.filter(estudiante =>
    estudiante.carrera.toLowerCase() === carrera.toLowerCase() &&
    estudiante.calificacionesEnviadas.includes('psicotecnica') &&
    estudiante.calificacionesEnviadas.includes('logica') &&
    estudiante.calificacionesEnviadas.length > 0 &&
    estudiante.estadoSeleccion !== 'Inactivo' // Solo estudiantes en proceso pueden ser ganadores
  );

  if (estudiantesCarrera.length === 0) {
    return null;
  }

  let mejorPromedio = 0;
  let ganador = null;

  estudiantesCarrera.forEach(estudiante => {
    const promedio = parseFloat(estudiante.promedio);
    if (promedio > mejorPromedio) {
      mejorPromedio = promedio;
      ganador = estudiante;
    }
  });

  return ganador ? (
    <div className='ganador'>
      <h2>Ganador</h2>
      <p>{ganador.nombre} - Promedio: {mejorPromedio}</p>
    </div>
    
  ) : null;
}

export default Formulario;
