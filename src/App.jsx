import "./App.css";
import { AppProvider } from "./context/AppProvider";
import AlumnosPage from "./pages/AlumnosPage";
import BarraNavegacion from "./components/BarraNavegacion/BarraNavegacion";
import Home from "./pages/Home";
import { Route, Routes } from "react-router";

function App() {
  return (
    <>
      <BarraNavegacion />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/alumnos"
          element={
            <AppProvider>
              <div className="pagina-alumnos container mt-4">
                <h1 className="mb-4">Listado de Alumnos</h1>
                <AlumnosPage />
              </div>
            </AppProvider>
          }
        />
      </Routes>
    </>
  );
}

export default App;
