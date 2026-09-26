import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useApp } from "../context/AppContext";
import Alerta from "./Alerta";

function ModalAlumno({ mostrar, alCerrar }) {
  const { guardarAlumnoLegajo } = useApp();
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    legajo: "",
  });
  const [guardando, setGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  const actualizarCampo = (evento) => {
    const { name, value } = evento.target;
    setFormulario((valoresActuales) => ({
      ...valoresActuales,
      [name]: value,
    }));
  };

  const guardarAlumno = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setMensajeError(null);
    setMensajeExito(null);

    try {
      await guardarAlumnoLegajo({
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        // Valor temporal hasta implementar el inicio de sesión.
        idUsuario: 6,
        legajo: { numero: formulario.legajo },
      });
      setFormulario({ nombre: "", apellido: "", legajo: "" });
      setMensajeExito("Alumno guardado correctamente.");
    } catch (err) {
      const datosError = err.response?.data;
      const mensajeValidacion = datosError && typeof datosError === "object"
        ? Object.values(datosError).join(" ")
        : null;
      setMensajeError(mensajeValidacion || "No se pudo guardar el alumno.");
    } finally {
      setGuardando(false);
    }
  };

  const cerrarModal = () => {
    if (!guardando) {
      setMensajeError(null);
      setMensajeExito(null);
      alCerrar();
    }
  };

  return (
    <Modal show={mostrar} onHide={cerrarModal} centered>
      <Form onSubmit={guardarAlumno}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar alumno</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Alerta tipo="success" mensaje={mensajeExito} />
          <Alerta tipo="danger" mensaje={mensajeError} />

          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={actualizarCampo}
              placeholder="Ingrese el nombre"
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="apellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={formulario.apellido}
              onChange={actualizarCampo}
              placeholder="Ingrese el apellido"
              required
            />
          </Form.Group>

          <Form.Group controlId="legajo">
            <Form.Label>Legajo</Form.Label>
            <Form.Control
              type="text"
              name="legajo"
              value={formulario.legajo}
              onChange={actualizarCampo}
              placeholder="Ingrese el número de legajo"
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal} disabled={guardando}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModalAlumno;
