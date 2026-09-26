import { useCallback, useEffect, useMemo, useState } from "react";
import {
  guardarAlumnoLegajo as guardarAlumnoLegajoServicio,
  listarAlumnos,
} from "../servicio/alumnoServicio";
import { AppContext } from "./AppContext";

// Proveedor: dueño del estado y del consumo de la API.
export function AppProvider({ children }) {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const recargarAlumnos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await listarAlumnos();
      setAlumnos(datos);
    } catch (err) {
      // El backend devuelve { status, message } en los errores 404/400.
      setError(err.response?.data?.message || "Error al obtener los alumnos");
    } finally {
      setCargando(false);
    }
  }, []);

  const guardarAlumnoLegajo = useCallback(
    async (alumnoConLegajo) => {
      const alumnoGuardado = await guardarAlumnoLegajoServicio(alumnoConLegajo);
      await recargarAlumnos();
      return alumnoGuardado;
    },
    [recargarAlumnos]
  );

  // Consumo de la API una sola vez al montar el proveedor.
  useEffect(() => {
    const cargarAlumnosIniciales = async () => {
      await recargarAlumnos();
    };

    cargarAlumnosIniciales();
  }, [recargarAlumnos]);

  // useMemo evita crear un objeto nuevo en cada render (buena práctica).
  const valor = useMemo(
    () => ({ alumnos, cargando, error, guardarAlumnoLegajo }),
    [alumnos, cargando, error, guardarAlumnoLegajo]
  );

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}
