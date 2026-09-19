import "./App.css";
import ListaAlumno from "./components/ListaAlumno";
import { AppProvider } from "./context/AppProvider";

function App() {
  return (
    <AppProvider>
      <div className="container mt-4">
        <h1 className="mb-4">Listado de Alumnos</h1>
        <ListaAlumno />
      </div>
    </AppProvider>
  );
}

export default App;

