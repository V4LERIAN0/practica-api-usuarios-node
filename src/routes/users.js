// IMportamos Router desde express para crear un conjunto de rutas
import { Router } from 'express';

import * as userControllers from '../Controllers/usersControllers.js';

// Importamos validaciones y el runner que las ejecuta
import { createUserValidators, runValidations } from '../Middlewares/validators.js';

// // Creamos una instancia de router
const router = Router();

// Ruta para obtener todos los usuarios (GET /users)
router.get ('/', userControllers.getAllUsers);

// Ruta para obtener un usuario por email (GET /users/:email)
router.get('/buscarPorEmail/:email', userControllers.getUserByEmail);

// // Ruta para buscar usuarios por nombre (GET /users/buscarPorNombre/:nombre)
router.get('/buscarPorNombre/:nombre', userControllers.getUserByName);

// Ruta para crear un nuevo usuario (POST /users)
// Primero se ejecuta runValidations(createUserValidators) y si las pasa entra a userControllers.postCreateUser
router.post('/', runValidations(createUserValidators), userControllers.postCreateUser);

// Ruta para actualizar un usuario (PUT /:id_usuario)
router.put('/:id_usuario', userControllers.putUpdateUser);

// Ruta para eliminar un usuario (DELETE /:id_usuario)
router.delete('/:id_usuario', userControllers.deleteEliminarUsuario);

// // Exportamos el router para usarlo en index.js
export default router;