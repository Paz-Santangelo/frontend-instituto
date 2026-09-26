import { useState } from "react";
import { Alert, Button, Spinner, Table } from "react-bootstrap";
import ModalAlumno from "../components/ModalAlumno";
import { useApp } from "../context/AppContext";

// Componente hijo: consume el estado compartido mediante el hook useApp.
function AlumnosPage() {
  const { alumnos, cargando, error } = useApp();
  const [mostrarModal, setMostrarModal] = useState(false);

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
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button type="button" variant="success" onClick={() => setMostrarModal(true)}>
          <i className="bi bi-plus-lg me-2" aria-hidden="true" />
          Agregar nuevo
        </Button>
      </div>

      <Table className="tabla-alumnos" striped bordered hover responsive>
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

      <ModalAlumno
        mostrar={mostrarModal}
        alCerrar={() => setMostrarModal(false)}
      />
    </>
  );
}

export default AlumnosPage;
