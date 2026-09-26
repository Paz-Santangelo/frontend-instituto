import { Button, Container } from "react-bootstrap";
import { Link } from "react-router";

function Home() {
  return (
    <Container className="pagina-home mt-5">
      <h1>Bienvenidos al Instituto</h1>
      <p>Desde aquí podés consultar y gestionar la información de los alumnos.</p>
      <Button as={Link} to="/alumnos" variant="warning">
        Ir al listado de alumnos
      </Button>
    </Container>
  );
}

export default Home;
