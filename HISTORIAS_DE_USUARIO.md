# Historias de Usuario — Frontend Instituto

> Documento de trabajo para el equipo de **5 integrantes**.
> Proyecto: `frontend-instituto` (React 19 + Vite 8, JavaScript).
> Fuente de la API: `ENDPOINTS.md`.

---

## Decisiones técnicas previas

| Tema | Decisión | Justificación |
|------|----------|---------------|
| Cliente HTTP | **Axios** | Consumo simple de la API REST, interceptores y manejo de errores centralizado. |
| Librería de UI | **React Bootstrap** | Componentes listos + estilos Bootstrap con soporte React. |
| Ubicación de los servicios | Carpeta **`src/servicio`** | Separar la capa de datos de la capa de UI (separación de responsabilidades). |
| URL de la API | Variable de entorno **`VITE_API_URL`** | Vite solo expone al cliente las variables con prefijo `VITE_`. Evita valores "hardcodeados". |
| Seguridad | `.env` ignorado por Git + archivo `.env.example` | No versionar configuraciones sensibles; documentar las variables necesarias. |

**Convención de nombres:**
- Cada servicio se implementa en un archivo dentro de `src/servicio`.
- Las funciones del servicio usan **named exports** (para importarlas de forma explícita y clara).
- Las funciones retornan `respuesta.data` (el cuerpo de la respuesta ya deserializado) y dejan que el error se propague al llamador.

> **Importante:** los endpoints de éxito (`POST`/`DELETE`) devuelven **texto plano** (ej.: `"Alumno guardado correctamente"`). Las funciones del servicio deben retornar ese string tal cual. Los errores 404/400 devuelven JSON.

---

## HU-01 — Configuración inicial: dependencias, entorno y cliente Axios base

**Como** desarrollador del equipo,
**quiero** tener configurado Axios, React Bootstrap y la variable de entorno de la API,
**para** poder empezar a implementar los servicios con una base común y sin valores hardcodeados.

### Descripción

Es la historia **fundacional**: habilita al resto del equipo. Instala las dependencias, crea el archivo de entorno, la carpeta `servicio` y un cliente Axios compartido.

### Criterios de aceptación

1. **Dado** que se ejecuta `npm install axios react-bootstrap bootstrap`,
   **cuando** se revisa `package.json`,
   **entonces** aparecen `axios`, `react-bootstrap` y `bootstrap` en `dependencies`.

2. **Dado** que Bootstrap requiere importar su CSS,
   **cuando** se revisa `src/main.jsx`,
   **entonces** está importado `import 'bootstrap/dist/css/bootstrap.min.css'`.

3. **Dado** que la URL de la API no debe estar hardcodeada,
   **cuando** se crea el archivo `.env` en la raíz del proyecto,
   **entonces** contiene `VITE_API_URL=http://localhost:8080`.

4. **Dado** que se siguen buenas prácticas de seguridad,
   **cuando** se revisa `.gitignore`,
   **entonces** el archivo `.env` está ignorado (no se versiona) y existe un `.env.example` con la variable `VITE_API_URL=` documentada (sin valor sensible).

5. **Dado** que se separa la capa de datos,
   **cuando** se crea la carpeta `src/servicio`,
   **entonces** existe el archivo `src/servicio/axiosConfig.js`.

6. **Dado** que todos los servicios deben compartir la misma base,
   **cuando** se revisa `src/servicio/axiosConfig.js`,
   **entonces** exporta (por defecto) una instancia de Axios creada con `axios.create({ baseURL: import.meta.env.VITE_API_URL })` y el header `Content-Type: application/json`.

7. **Dado** que la app debe seguir compilando,
   **cuando** se ejecuta `npm run dev`,
   **entonces** el proyecto levanta sin errores.

### Definición de Hecho (DoD)
- Dependencias instaladas y reflejadas en `package.json` / `package-lock.json`.
- `.env` y `.env.example` creados; `.env` en `.gitignore`.
- `src/servicio/axiosConfig.js` implementado y exportando el cliente base.
- `npm run dev` funciona.

---

## HU-02 — Servicio de Alumnos: consultas (lectura)

**Como** desarrollador,
**quiero** contar con funciones para listar, obtener por id y buscar alumnos por apellido,
**para** que la UI pueda mostrar la información de los alumnos.

### Descripción

Crea `src/servicio/alumnoServicio.js` con las operaciones de lectura (GET) del dominio Alumno.

### Criterios de aceptación

1. **Dado** el endpoint `GET /api/alumnos/obtener/todos`,
   **cuando** se invoca `listarAlumnos()`,
   **entonces** retorna la lista de `AlumnoDtoResponse` (o la lista vacía `[]` si no hay datos).

2. **Dado** el endpoint `GET /api/alumnos/obtener-alumno-dto/{id}`,
   **cuando** se invoca `obtenerAlumnoPorId(id)`,
   **entonces** retorna el objeto `AlumnoDtoResponse` correspondiente.

3. **Dado** el endpoint `GET /api/alumnos/buscar/{apellido}`,
   **cuando** se invoca `buscarAlumnosPorApellido(apellido)`,
   **entonces** retorna la lista de alumnos coincidentes (o `[]` si no hay coincidencias).

4. **Dado** que el alumno no existe,
   **cuando** `obtenerAlumnoPorId(99)` recibe un 404,
   **entonces** la función lanza (propaga) el error con `{ status: "NOT_FOUND", message: "..." }`, sin romper la app.

5. **Dado** que se sigue la convención del equipo,
   **cuando** se revisa el archivo,
   **entonces** importa el cliente desde `./axiosConfig` y las funciones usan **named exports**.

### Definición de Hecho (DoD)
- `src/servicio/alumnoServicio.js` con `listarAlumnos`, `obtenerAlumnoPorId` y `buscarAlumnosPorApellido`.
- Cada función usa el cliente Axios compartido y retorna `respuesta.data`.

---

## HU-03 — Servicio de Alumnos: escritura (crear y eliminar)

**Como** desarrollador,
**quiero** contar con funciones para guardar y eliminar alumnos,
**para** que la UI pueda gestionar el alta y la baja de alumnos.

### Descripción

Completa `src/servicio/alumnoServicio.js` con las operaciones de escritura (POST y DELETE).

### Criterios de aceptación

1. **Dado** el endpoint `POST /api/alumnos/guardar-dto`,
   **cuando** se invoca `guardarAlumno({ nombre, apellido, idUsuario })`,
   **entonces** envía el body en JSON y retorna el string `"Alumno guardado correctamente"`.

2. **Dado** el endpoint `DELETE /api/alumnos/eliminar/{id}`,
   **cuando** se invoca `eliminarAlumno(id)`,
   **entonces** ejecuta la eliminación (el backend responde 200 sin cuerpo) y no retorna datos.

3. **Dado** que el body de `guardarAlumno` requiere `nombre` y `apellido`,
   **cuando** faltan o están vacíos,
   **entonces** la API responde 400 con `{ nombre: "..." }` / `{ apellido: "..." }` y la función propaga el error.

4. **Dado** que `idUsuario` puede no existir,
   **cuando** el backend responde 404,
   **entonces** la función propaga el error `{ status: "NOT_FOUND", message: "Usuario no encontrado con id: X" }`.

5. **Dado** que el equipo debe integrar sin conflictos,
   **cuando** se revisa el archivo,
   **entonces** las funciones se agregan al mismo `alumnoServicio.js` (sin duplicar el archivo) y se integran con las de HU-02.

### Definición de Hecho (DoD)
- `guardarAlumno` y `eliminarAlumno` implementadas en `alumnoServicio.js`.
- El archivo convive con las funciones de consulta sin conflictos.

---

## HU-04 — Servicio de Legajos: escritura (dos variantes de alta)

**Como** desarrollador,
**quiero** contar con funciones para guardar legajos (por `idAlumno` en la ruta y con alumno en el cuerpo),
**para** que la UI pueda crear legajos de las dos formas que soporta la API.

### Descripción

Crea `src/servicio/legajoServicio.js` con las dos operaciones de alta de legajo.

### Criterios de aceptación

1. **Dado** el endpoint `POST /api/legajos/guardar/{idAlumno}`,
   **cuando** se invoca `guardarLegajoPorIdAlumno(idAlumno, { numero })`,
   **entonces** envía el body `{ "numero": "..." }` y retorna el string `"Legajo guardado correctamente"`.

2. **Dado** el endpoint `POST /api/legajos/guardar`,
   **cuando** se invoca `guardarLegajo({ numero, alumno: { id } })`,
   **entonces** envía el legajo con el alumno embebido y retorna el string `"Legajo guardado correctamente"`.

3. **Dado** que la API asigna la `fechaAlta` automáticamente,
   **cuando** se guarda un legajo,
   **entonces** el servicio no envía `fechaAlta` ni `id` (el body solo lleva lo necesario).

4. **Dado** que el número no puede estar vacío o el alumno no existir,
   **cuando** el backend responde error (404 o 500 por `IllegalArgumentException`),
   **entonces** la función propaga el error para que la UI lo maneje.

5. **Dado** que se sigue la convención del equipo,
   **cuando** se revisa el archivo,
   **entonces** importa el cliente desde `./axiosConfig` y usa **named exports**.

### Definición de Hecho (DoD)
- `src/servicio/legajoServicio.js` con `guardarLegajoPorIdAlumno` y `guardarLegajo`.

---

## HU-05 — Servicio de Legajos: consultas y eliminación

**Como** desarrollador,
**quiero** contar con funciones para listar, obtener y eliminar legajos,
**para** que la UI pueda mostrar y gestionar los legajos existentes.

### Descripción

Completa `src/servicio/legajoServicio.js` con las operaciones de lectura y borrado.

### Criterios de aceptación

1. **Dado** el endpoint `GET /api/legajos/obtener/todos`,
   **cuando** se invoca `listarLegajos()`,
   **entonces** retorna la lista de legajos (cada uno con su `alumno` embebido).

2. **Dado** el endpoint `GET /api/legajos/obtener/{id}`,
   **cuando** se invoca `obtenerLegajoPorId(id)`,
   **entonces** retorna el objeto `Legajo` correspondiente.

3. **Dado** el endpoint `DELETE /api/legajos/eliminar/{id}`,
   **cuando** se invoca `eliminarLegajo(id)`,
   **entonces** ejecuta el borrado y retorna el string `"Legajo eliminado correctamente"`.

4. **Dado** que el legajo no existe,
   **cuando** `obtenerLegajoPorId(99)` recibe un 404,
   **entonces** la función propaga el error `{ status: "NOT_FOUND", message: "Legajo no encontrado con id: 99" }`.

5. **Dado** que el equipo debe integrar sin conflictos,
   **cuando** se revisa el archivo,
   **entonces** las funciones se agregan al mismo `legajoServicio.js` (sin duplicar) y se integran con las de HU-04.

### Definición de Hecho (DoD)
- `listarLegajos`, `obtenerLegajoPorId` y `eliminarLegajo` implementadas.
- El archivo `legajoServicio.js` convive con las funciones de escritura sin conflictos.

---

## Distribución sugerida por integrante (5 personas)

| Integrante | Historia | Archivo(s) | Endpoints que cubre |
|-----------|----------|------------|---------------------|
| 1 | HU-01 | `package.json`, `.env`, `.env.example`, `.gitignore`, `src/main.jsx`, `src/servicio/axiosConfig.js` | Infraestructura (base para todos) |
| 2 | HU-02 | `src/servicio/alumnoServicio.js` | GET alumnos (todos, por id, por apellido) |
| 3 | HU-03 | `src/servicio/alumnoServicio.js` | POST guardar-dto, DELETE alumno |
| 4 | HU-04 | `src/servicio/legajoServicio.js` | POST legajos (2 variantes) |
| 5 | HU-05 | `src/servicio/legajoServicio.js` | GET legajos (todos, por id), DELETE legajo |

> **Dependencia:** HU-01 es bloqueante para HU-02 a HU-05 (todos dependen del cliente Axios base y de la variable de entorno). Se recomienda que el Integrante 1 la finalice y valide primero, o acordar en equipo la estructura de `axiosConfig.js` antes de repartir el resto.

---

## Notas de seguridad y buenas prácticas aplicadas

1. **Variable de entorno:** la URL base se lee de `import.meta.env.VITE_API_URL` (nunca hardcodeada). En Vite solo se exponen al cliente las variables con prefijo `VITE_`.
2. **No versionar secretos:** `.env` está en `.gitignore`. Se versiona un `.env.example` que documenta las variables sin exponer valores reales.
3. **Cliente único:** una sola instancia de Axios (`axiosConfig.js`) centraliza `baseURL` y headers, evitando duplicación.
4. **Separación de capas:** la carpeta `src/servicio` aísla las llamadas HTTP de los componentes React (UI).
5. **Propagación de errores:** las funciones del servicio no "tragan" errores; los dejan subir para que la UI decida cómo mostrarlos (los 404/400 llegan como JSON, y los 500 como error genérico).


