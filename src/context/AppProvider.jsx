import { useEffect, useMemo, useState } from "react";
import { listarAlumnos } from "../servicio/alumnoServicio";
import { AppContext } from "./AppContext";

// Proveedor: dueño del estado y del consumo de la API.
export function AppProvider({ children }) {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Consumo de la API una sola vez al montar el proveedor.
  useEffect(() => {
    const obtenerAlumnos = async () => {
      try {
        setCargando(true);
        const datos = await listarAlumnos();
        setAlumnos(datos);
      } catch (err) {
        // El backend devuelve { status, message } en los errores 404/400.
        setError(err.response?.data?.message || "Error al obtener los alumnos");
      } finally {
        setCargando(false);
      }
    };

    obtenerAlumnos();
  }, []);

  // useMemo evita crear un objeto nuevo en cada render (buena práctica).
  const valor = useMemo(
    () => ({ alumnos, cargando, error }),
    [alumnos, cargando, error]
  );

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}
