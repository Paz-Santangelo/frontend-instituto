import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router";
import logoUPC from "../../assets/logo-UPC.png";
import "./BarraNavegacion.css";

function BarraNavegacion() {
  return (
    <Navbar expand="lg" className="barra-navegacion-upc">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
          <span className="logo-upc-circulo">
            <img src={logoUPC} alt="Logo de la UPC" />
          </span>
          <span>Instituto</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navegacion-principal" />
        <Navbar.Collapse id="navegacion-principal" className="justify-content-end">
          <Nav>
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/alumnos">Alumnos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BarraNavegacion;
