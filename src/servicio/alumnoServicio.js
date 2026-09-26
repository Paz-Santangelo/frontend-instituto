import clienteAxios from './axiosConfig'

// ============================================================
// Servicio de Alumnos
// ============================================================
// Convenciones:
//  - Named exports para importar cada función de forma explícita.
//  - Cada función retorna `respuesta.data` (cuerpo ya deserializado).
//  - Los errores (404/400) se propagan al llamador para que la UI los maneje.

// ---------- Consultas (GET) ----------

// GET /api/alumnos/obtener/todos
// Retorna: lista de AlumnoDtoResponse (o [] si no hay datos)
export const listarAlumnos = async () => {
  const respuesta = await clienteAxios.get('/api/alumnos/obtener/todos')
  return respuesta.data
}

// GET /api/alumnos/obtener-alumno-dto/{id}
// Retorna: objeto AlumnoDtoResponse
export const obtenerAlumnoPorId = async (id) => {
  const respuesta = await clienteAxios.get(`/api/alumnos/obtener-alumno-dto/${id}`)
  return respuesta.data
}

// GET /api/alumnos/buscar/{apellido}
// Retorna: lista de Alumno (o [] si no hay coincidencias)
export const buscarAlumnosPorApellido = async (apellido) => {
  const respuesta = await clienteAxios.get(`/api/alumnos/buscar/${apellido}`)
  return respuesta.data
}

// ---------- Escritura (POST / DELETE) ----------

// POST /api/alumnos/guardar-dto
// Body: { nombre, apellido, idUsuario? }
// Retorna: string "Alumno guardado correctamente"
export const guardarAlumno = async (alumnoDto) => {
  const respuesta = await clienteAxios.post('/api/alumnos/guardar-dto', alumnoDto)
  return respuesta.data
}

// POST /api/alumnos/guardar-con-legajo
// Body: { nombre, apellido, idUsuario?, legajo: { numero } }
// Retorna: AlumnoDtoResponse con el legajo creado.
export const guardarAlumnoLegajo = async (alumnoConLegajoDto) => {
  const respuesta = await clienteAxios.post('/api/alumnos/guardar-con-legajo', alumnoConLegajoDto)
  return respuesta.data
}

// DELETE /api/alumnos/eliminar/{id}
// Retorna: nada (el backend responde 200 sin cuerpo)
export const eliminarAlumno = async (id) => {
  await clienteAxios.delete(`/api/alumnos/eliminar/${id}`)
}
