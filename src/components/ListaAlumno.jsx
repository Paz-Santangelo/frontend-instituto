import { Alert, Spinner, Table } from "react-bootstrap";
import { useApp } from "../context/AppContext";

// Componente hijo: consume el estado compartido mediante el hook useApp.
function ListaAlumno() {
  const { alumnos, cargando, error } = useApp();

  // Pantalla de carga
  if (cargando) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  // Pantalla de error
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // Listado de alumnos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Legajo</th>
          <th>Fecha de alta</th>
        </tr>
      </thead>
      <tbody>
        {alumnos.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center">
              No hay alumnos registrados
            </td>
          </tr>
        ) : (
          alumnos.map((alumno, index) => (
            <tr key={index}>
              <td>{alumno.nombre}</td>
              <td>{alumno.apellido}</td>
              <td>{alumno.legajo ? alumno.legajo.numero : "Sin legajo"}</td>
              <td>{alumno.legajo ? alumno.legajo.fechaAlta : "—"}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default ListaAlumno;
