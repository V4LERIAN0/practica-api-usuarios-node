// Importamos express, el framework para manejar las rutas y peticiones HTTP
import express from 'express';

// Importamos nuestro router de usuarios
import usersRouter from './routes/users.js';

// Importamos las variables de entorno desde el archivo .env
import dotenv from 'dotenv';
dotenv.config();

// Creamos una instancia de la aplicación Express (nuestro servidor)
const app = express();

// Middleware que permite interpretar JSON en las peticiones
app.use(express.json());

// Definimos una ruta GET en la raíz ("/") que responde con un mensaje de bienvenida
app.get('/', (req, res) => {
  res.send('¡Hola, mundo UNICAES! El servidor está funcionando correctamente.');
});

// Asociamos todas las rutas de usuario al prefijo "/users"
app.use('/users', usersRouter);

// Iniciamos el servidor en el puerto definido en las variables de entorno 
// o en el puerto 3000 por defecto
app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
});