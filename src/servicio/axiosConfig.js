import axios from 'axios'

// Instancia única de Axios con la URL base leída desde la variable de entorno.
// En Vite, las variables de entorno del cliente deben llevar el prefijo VITE_.
const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default clienteAxios
