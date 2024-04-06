import React, { useState } from 'react';

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
    { nombre: "Juan Pérez", carrera: "Ingeniería Informática", estadoSeleccion: "En proceso", calificacionPsicotecnica: null, calificacionLogica: null, calificacionEntrevistaPersonal: null, calificacionEntrevistaJefe: null, calificacionesEnviadas: [], promedio: null },
    { nombre: "María Gutiérrez", carrera: "Ingeniería Informática", estadoSeleccion: "En proceso", calificacionPsicotecnica: null, calificacionLogica: null, calificacionEntrevistaPersonal: null, calificacionEntrevistaJefe: null, calificacionesEnviadas: [], promedio: null },
    { nombre: "Carlos Martínez", carrera: "Ingeniería Informática", estadoSeleccion: "En proceso", calificacionPsicotecnica: null, calificacionLogica: null, calificacionEntrevistaPersonal: null, calificacionEntrevistaJefe: null, calificacionesEnviadas: [], promedio: null },
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
        return {
          ...estudiante,
          [`calificacion${tipoPrueba.charAt(0).toUpperCase() + tipoPrueba.slice(1)}`]: calificacion,
          calificacionesEnviadas: nuevasCalificaciones,
          promedio: promedio
        };
      }
      return estudiante;
    });
    // Actualizar el objeto de estudiantes con las calificaciones guardadas
    setEstudiantes(estudiantesActualizados);
    // Limpiar el formulario de calificaciones
    setFormData({
      ...formData,
      [tipoPrueba]: ''
    });
    // Limpiar el estado del estudiante encontrado y establecer el estado de búsqueda en false
    setEstudianteEncontrado(null);
    setNoEncontrado(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="carrera">Carrera:</label>
          <input
            type="text"
            id="carrera"
            name="carrera"
            value={formData.carrera}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Buscar</button>
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
        {/* Mostrar mensaje de estado "Inactivo" si el estudiante no está en proceso de selección */}
        {estudianteEncontrado && estudianteEncontrado.estadoSeleccion === 'Inactivo' && (
          <p>Este estudiante ya no está en proceso de selección.</p>
        )}
        {/* Botones para cada tipo de prueba */}
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
        estudiante.calificacionesEnviadas.length > 0
      ).map(estudiante => (
        <div key={estudiante.nombre}>
          <h2>{estudiante.nombre}</h2>
          <p>Carrera: {estudiante.carrera}</p>
          <p>Estado de selección: {estudiante.estadoSeleccion}</p>
          <p>Calificaciones:</p>
          {estudiante.calificacionesEnviadas.map(calificacion => (
            <p key={calificacion}>
              {calificacion.charAt(0).toUpperCase() + calificacion.slice(1)}: {estudiante[`calificacion${calificacion.charAt(0).toUpperCase() + calificacion.slice(1)}`]}
            </p>
          ))}
          {/* Mostrar promedio */}
          <p>Promedio: {estudiante.promedio}</p>
        </div>
      ))}
      {/* Mostrar al estudiante con el mejor promedio que haya hecho ambas calificaciones */}
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
    estudiante.calificacionesEnviadas.length > 0
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
    <div>
      <h2>Ganador</h2>
      <p>{ganador.nombre} - Promedio: {mejorPromedio}</p>
    </div>
  ) : null;
}

export default Formulario;
