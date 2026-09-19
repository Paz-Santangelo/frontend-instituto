/* global process */
// Script de prueba: consume GET /api/alumnos/obtener/todos
//
// Uso:
//   node scripts/test-alumnos.js
//   node --env-file=.env scripts/test-alumnos.js   (Node >= 20.6: lee VITE_API_URL del .env)

const BASE_URL = process.env.VITE_API_URL || "http://localhost:8080";

async function probarListaAlumnos() {
  const url = `${BASE_URL}/api/alumnos/obtener/todos`;
  console.log(`→ GET ${url}\n`);

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      console.error(`✖ Error HTTP ${respuesta.status} ${respuesta.statusText}`);
      const cuerpo = await respuesta.json().catch(() => null);
      if (cuerpo) {
        console.error("Detalle:", JSON.stringify(cuerpo, null, 2));
      }
      process.exitCode = 1;
      return;
    }

    const alumnos = await respuesta.json();
    console.log(`✔ 200 OK — ${alumnos.length} alumno(s) encontrados.\n`);

    if (alumnos.length === 0) {
      console.log("No hay alumnos registrados.");
      return;
    }

    console.table(
      alumnos.map((alumno) => ({
        Nombre: alumno.nombre,
        Apellido: alumno.apellido,
        Legajo: alumno.legajo ? alumno.legajo.numero : "Sin legajo",
        "Fecha de alta": alumno.legajo ? alumno.legajo.fechaAlta : "—",
      }))
    );
  } catch (err) {
    console.error("✖ No se pudo conectar con la API.");
    console.error(`  Verificá que el backend esté corriendo en ${BASE_URL}`);
    console.error(`  Detalle: ${err.message}`);
    process.exitCode = 1;
  }
}

probarListaAlumnos();
