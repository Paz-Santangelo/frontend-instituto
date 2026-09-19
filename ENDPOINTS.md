# Documentación de Endpoints — Instituto

API REST del proyecto `Instituto` (Spring Boot).

> **Base URL:** `http://localhost:8080`

> **Autenticación:** actualmente la seguridad está abierta (`SecurityConfig` con `.anyRequest().permitAll()`), por lo que **no se requiere token JWT** para consumir estos endpoints. Los decoradores `@PreAuthorize` existen pero están comentados.

---

## Formato de errores (respuestas de error)

El manejo global de excepciones (`ManejadorGlobalExcepciones`) devuelve:

| Código | Tipo de error | Cuerpo |
|--------|---------------|--------|
| 404 | `NoEncontradoExcepcion` | `{ "status": "NOT_FOUND", "message": "..." }` |
| 400 | Error de validación (`@Valid`) | `{ "nombreCampo": "mensaje de error" }` |

> **Nota:** las validaciones manuales que lanzan `IllegalArgumentException` (por ejemplo, número de legajo vacío) **no** están capturadas por el manejador global, por lo que Spring respondería con un error `500` por defecto.

---

## Endpoints de Alumno

Base: `/api/alumnos`

### 1. Guardar alumno (DTO)

Crea un alumno asociado a un usuario existente.

- **Método:** `POST`
- **Ruta:** `/api/alumnos/guardar-dto`

**Body de entrada (`AlumnoDtoRequest`):**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `nombre` | `string` | Sí | Nombre del alumno. No puede estar vacío. |
| `apellido` | `string` | Sí | Apellido del alumno. No puede estar vacío. |
| `idUsuario` | `number (Long)` | No | ID del usuario existente a vincular. |

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "idUsuario": 1
}
```

**Respuestas:**

- **201 Created** — cuerpo (texto): `"Alumno guardado correctamente"`
- **400 Bad Request** — si `nombre` o `apellido` están vacíos:
  ```json
  { "nombre": "Por favor, ingrese el nombre del alumno." }
  ```
- **404 Not Found** — si el `idUsuario` no existe:
  ```json
  { "status": "NOT_FOUND", "message": "Usuario no encontrado con id: 1" }
  ```

---

### 2. Listar todos los alumnos

- **Método:** `GET`
- **Ruta:** `/api/alumnos/obtener/todos`
- **Parámetros:** ninguno.

**Respuesta:**

- **200 OK** — lista de objetos `AlumnoDtoResponse`.

```json
[
  {
    "nombre": "Juan",
    "apellido": "Pérez",
    "legajo": { "numero": "L-1234", "fechaAlta": "2024-03-15" }
  }
]
```

> El DTO `AlumnoDtoResponse` solo expone `nombre`, `apellido` y `legajo` (con `numero` y `fechaAlta`). Si el alumno no tiene legajo, `legajo` será `null`.

---

### 3. Obtener alumno por id (DTO)

- **Método:** `GET`
- **Ruta:** `/api/alumnos/obtener-alumno-dto/{id}`

**Parámetro de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `number (Long)` | ID del alumno. |

**Respuestas:**

- **200 OK** — objeto `AlumnoDtoResponse`:

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "legajo": { "numero": "L-1234", "fechaAlta": "2024-03-15" }
}
```

- **404 Not Found** — si el alumno no existe:
  ```json
  { "status": "NOT_FOUND", "message": "Alumno no encontrado con id: 99" }
  ```

---

### 4. Eliminar alumno

- **Método:** `DELETE`
- **Ruta:** `/api/alumnos/eliminar/{id}`

**Parámetro de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `number (Long)` | ID del alumno. |

**Respuestas:**

- **200 OK** — sin cuerpo (el método retorna `void`).
- **404 Not Found** — si el alumno no existe:
  ```json
  { "status": "NOT_FOUND", "message": "Alumno no encontrado con id: 99" }
  ```

---

### 5. Buscar alumnos por apellido

- **Método:** `GET`
- **Ruta:** `/api/alumnos/buscar/{apellido}`

**Parámetro de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `apellido` | `string` | Apellido exacto a buscar. |

**Respuesta:**

- **200 OK** — lista de objetos `Alumno`. Si no hay coincidencias, retorna una lista vacía `[]`.

```json
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "legajo": null,
    "usuario": null,
    "materias": null
  }
]
```

---

## Endpoints de Legajo

Base: `/api/legajos`

### 6. Guardar legajo (alumno por parámetro)

Crea un legajo vinculado al alumno indicado en la ruta.

- **Método:** `POST`
- **Ruta:** `/api/legajos/guardar/{idAlumno}`

**Parámetro de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `idAlumno` | `number (Long)` | ID del alumno al que se vincula el legajo. |

**Body de entrada (`Legajo`):**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `numero` | `string` | Sí | Número del legajo. No puede estar vacío (`IllegalArgumentException` si lo está). |

> `id` y `fechaAlta` son ignorados en esta operación: la fecha se asigna automáticamente con la fecha actual en el servidor.

```json
{
  "numero": "L-1234"
}
```

**Respuestas:**

- **201 Created** — cuerpo (texto): `"Legajo guardado correctamente"`
- **404 Not Found** — si el alumno no existe:
  ```json
  { "status": "NOT_FOUND", "message": "Alumno no encontrado con id: 99" }
  ```
- **500 Internal Server Error** (no manejado) — si `numero` está vacío (`IllegalArgumentException`):
  `"El número del legajo no puede estar vacío"`

---

### 7. Guardar legajo (alumno en el cuerpo)

Crea un legajo vinculado al alumno enviado dentro del cuerpo.

- **Método:** `POST`
- **Ruta:** `/api/legajos/guardar`

**Body de entrada (`Legajo`):**

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `numero` | `string` | Sí | Número del legajo. No puede estar vacío. |
| `alumno.id` | `number (Long)` | Sí | ID del alumno a vincular. Si falta, se produce un error (`NullPointerException`). |

```json
{
  "numero": "L-1234",
  "alumno": {
    "id": 1
  }
}
```

**Respuestas:**

- **201 Created** — cuerpo (texto): `"Legajo guardado correctamente"`
- **404 Not Found** — si el alumno no existe:
  ```json
  { "status": "NOT_FOUND", "message": "Alumno no encontrado con id: 99" }
  ```
- **500 Internal Server Error** (no manejado) — si `numero` está vacío (`IllegalArgumentException`) o `alumno` es nulo (`NullPointerException`).

---

### 8. Listar todos los legajos

- **Método:** `GET`
- **Ruta:** `/api/legajos/obtener/todos`
- **Parámetros:** ninguno.

**Respuesta:**

- **200 OK** — lista de objetos `Legajo`.

```json
[
  {
    "id": 10,
    "numero": "L-1234",
    "fechaAlta": "2024-03-15",
    "alumno": {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "legajo": null,
      "usuario": null,
      "materias": null
    }
  }
]
```

---

### 9. Obtener legajo por id

- **Método:** `GET`
- **Ruta:** `/api/legajos/obtener/{id}`

**Parámetro de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `number (Long)` | ID del legajo. |

**Respuestas:**

- **200 OK** — objeto `Legajo` (ver ejemplo en el punto 8).
- **404 Not Found** — si el legajo no existe:
  ```json
  { "status": "NOT_FOUND", "message": "Legajo no encontrado con id: 99" }
  ```

---

### 10. Eliminar legajo

- **Método:** `DELETE`
- **Ruta:** `/api/legajos/eliminar/{id}`

**Parámetro de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `number (Long)` | ID del legajo. |

**Respuestas:**

- **200 OK** — cuerpo (texto): `"Legajo eliminado correctamente"`
- **404 Not Found** — si el legajo no existe:
  ```json
  { "status": "NOT_FOUND", "message": "Legajo no encontrado con id: 99" }
  ```

---

## Resumen de mensajes de éxito devueltos

| Endpoint | Método | Mensaje de éxito |
|----------|--------|------------------|
| `/api/alumnos/guardar-dto` | POST | `"Alumno guardado correctamente"` (201) |
| `/api/legajos/guardar/{idAlumno}` | POST | `"Legajo guardado correctamente"` (201) |
| `/api/legajos/guardar` | POST | `"Legajo guardado correctamente"` (201) |
| `/api/legajos/eliminar/{id}` | DELETE | `"Legajo eliminado correctamente"` (200) |