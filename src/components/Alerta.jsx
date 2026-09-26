import { Alert } from "react-bootstrap";

function Alerta({ tipo, mensaje }) {
  if (!mensaje) {
    return null;
  }

  return <Alert variant={tipo}>{mensaje}</Alert>;
}

export default Alerta;
