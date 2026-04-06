// Importamos los métodos que se definieron en services/UserServices.js
import * as userServices from "../services/userServices.js";

export const getAllUsers = async (req, res, next) => {
  try {
    // Ejecutamos consulta SQL
    const result = await userServices.getAllUsersQuery();
    // Devolvemos el resultado en formato JSON
    res.json(result);
  } catch (err) {
    // En caso de error, se usa el middleware de manejo de errores
    return next(err);
  }
};

// Obtener usuarios por email
export const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const resultPorEmail = await userServices.getUserByEmailQuery(email);
    res.json(resultPorEmail);
  } catch (err) {
    return next(err);
  }
};

// Buscar usuario por nombre
export const getUserByName = async (req, res, next) => {
  try {
    const { nombre } = req.params;
    const resultPorNombre = await userServices.getUserByNameQuery(nombre);
    res.json(resultPorNombre);
  } catch (err) {
    return next(err);
  }
};

// Crear nuevo usuario
export const postCreateUser = async (req, res, next) => {
  try {
    // Extraemos los datos enviados en el body
    const { nombre, documento, carnet, email, contrasenia } = req.body;
    // Llamamos a la función del servicio que maneja la insersión a la DB
    const newUser = await userServices.postCrearUsuarioQuery(
      nombre,
      documento,
      carnet,
      email,
      contrasenia,
    );
    // Respondemos con el nuevo usuario creado
    res.status(201).json(newUser);
  } catch (err) {
    return next(err);
  }
};

export const putUpdateUser = async (req, res, next) => {
  try {
    const { nombre, documento, carnet, email, contrasenia } = req.body;
    const { id_usuario } = req.params;

    const usuario = [nombre, documento, carnet, email, contrasenia, id_usuario];

    const updatedUser = await userServices.actualizarUsuarioQuery(usuario);
    res.json(updatedUser);
  } catch (err) {
    return next(err);
  }
};

export const deleteEliminarUsuario = async (req, res, next) => {
  try {
    const { id_usuario } = req.params;

    const deletedUser = await userServices.eliminarUsuarioQuery(id_usuario);
    // Respondemos con el resultado de la eliminación
    res.status(200).json(deletedUser);
  } catch (err) {
    return next(err);
  }
};
