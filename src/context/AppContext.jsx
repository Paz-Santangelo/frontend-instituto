import { createContext, useContext } from "react";

// Contexto que compartirá el estado de los alumnos entre componentes.
export const AppContext = createContext(null);

// Hook personalizado para consumir el contexto de forma segura.
export function useApp() {
  const contexto = useContext(AppContext);

  if (contexto === null) {
    throw new Error("useApp debe usarse dentro de <AppProvider>");
  }

  return contexto;
}
