// IMportamos Router desde express para crear un conjunto de rutas
import { Router } from 'express';

// Importamos los métodos definidos en seervices/userServices.js
import { getAllUsers, getUserByEmail, getBuscarNombre, postCrearUsuario, actualizarUsuario, eliminarUsuario } from '../services/userServices.js';

// Creamos una instancia de router
const router = Router();

//Ruta para obtener todos los usuarios (GET /users)
router.get('/', getAllUsers);

// Ruta para obtener un usuario por email (GET /users/:email)
router.get('/buscarPorEmail/:email', getUserByEmail);

// Ruta para buscar usuarios por nombre (GET /users/buscarPorNombre/:nombre)
router.get('/buscarPorNombre/:nombre', async (req, res) => {
    const { nombre } = req.params;

    try {
        const allUsersByName = await getBuscarNombre(nombre);
        res.json(allUsersByName);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        // Extraemos los datos enviados en el body
        const { nombre, documento, carnet, email, contrasenia } = req.body;

        // Llamamos a la función del servicio que maneja la insersión a la DB
        const newUser = await postCrearUsuario(nombre, documento, carnet, email, contrasenia);

        // Respondemos con el nuevo usuario creado
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id_usuario', async (req, res) => {
    try {
        // Extraemos los datos enviados en el body
        const { nombre, documento, carnet, email, contrasenia } = req.body;

        // Extraemos el id_usuario de los parámetros de la URL
        const { id_usuario } = req.params;

        // Creamos un arreglo con los datos del usuario a actualizar
        const usuario = [nombre, documento, carnet, email, contrasenia, id_usuario];

        // Llamamos al servicio que maneja la actualización del usuario
        await actualizarUsuario(usuario, res);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para eliminar un usuario (DELETE /users/:id_usuario)
router.delete('/:id_usuario', async (req, res) => {
    try {
        // Extraemos el id_usuario de los parámetros de la URL
        const { id_usuario } = req.params;

        // Llamamos al servicio que maneja la eliminación en la BD
        const result = await eliminarUsuario(id_usuario);

        // Respondemos con el resultado de la eliminación
        res.status(200).json(result);
    } catch (err) {
        // Si hay error, respondemos con un mensaje de error
        res.status(500).json({ error: err.message });
    }
});

// Exportamos el router para usarlo en index.js
export default router;