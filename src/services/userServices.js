// RESPONSABILIDAD: Consulta la base de datos
// Importamos nuestro pool de conexiones
import { pool } from '../db.js';

// Importamos bcrypt para generar hashes y comparar contraseñas
import bcrypt from 'bcryptjs';

// Obtener todos los usuarios
export const getAllUsersQuery = async () => {
    //Ejecutamos la consulta SQL
    const [rows] = await pool.query('SELECT * FROM usuarios');
    // Develvemos el resultado de la consulta
    return rows;
};

// Obtener usuarios por email
export const getUserByEmailQuery = async (email) => {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return rows;
};

// Buscar usuario por nombre
export const getUserByNameQuery = async (nombre) => {
    const buscar = `%${nombre}%`;
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE nombre LIKE ?",
      [buscar],
    );
    return rows;
};

// Crear nuevo usuario 
export const postCrearUsuarioQuery = async (nombre, documento, carnet, email, contrasenia) => {
    // Número de salt rounds (cost). 10 es un valor razonable para desarrollo
    const SALT_ROUNDS = 10;
    // Generamos el salt de bcrypt (hash salado internamente)
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);

    // Generamos el hash a partir de la contraseña y el salt
    const contraseniaHashed = bcrypt.hashSync(contrasenia, salt);
        const query = `
            INSERT INTO usuarios
            (nombre, documento, carnet, email, contrasenia, bloqueado, ultimo_login, activo)
            VALUES (?, ?, ?, ?, ?, 'N', NULL, 'A')
        `;

        // Ejecutamos la consulta con los parametros proporcionados
        const [result] = await pool.query(query, [
            nombre,
            documento,
            carnet,
            email,
            contraseniaHashed
        ]);

        // Obtener el usuario recién creado
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [result.insertId]
        );

        return rows[0];
};

// Actualizar usuario
export const actualizarUsuarioQuery = async (usuario) => {
    const SALT_ROUNDS = 10;

    // usuario = [nombre, documento, carnet, email, contrasenia, id_usuario]
    const contraseniaHasheada = bcrypt.hashSync(usuario[4], SALT_ROUNDS);

    const datosActualizados = [
        usuario[0],
        usuario[1],
        usuario[2],
        usuario[3],
        contraseniaHasheada,
        usuario[5]
    ];

    const query = `UPDATE usuarios
        SET nombre=?,
            documento=?,
            carnet=?,
            email=?,
            contrasenia=?
        WHERE id_usuario=?`;

    const [result] = await pool.query(query, datosActualizados);

    if (result.affectedRows === 0) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
    }

    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE id_usuario = ?',
        [usuario[5]]
    );

    return rows[0];
};

// Eliminar usuario
export const eliminarUsuarioQuery = async (id_usuario) => {
    const [usuarioAEliminar] = await pool.query(
        'SELECT * FROM usuarios WHERE id_usuario = ?',
        [id_usuario]
    );

    if (usuarioAEliminar.length === 0) {
        throw new Error('Usuario no encontrado');
    }

    await pool.query(
        'DELETE FROM usuarios WHERE id_usuario = ?',
        [id_usuario]
    );

    return {
        message: 'Usuario eliminado correctamente',
        usuario: usuarioAEliminar[0]
    };
};