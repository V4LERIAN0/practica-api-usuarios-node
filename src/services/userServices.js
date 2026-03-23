// Importamos nuestro pool de conexiones
import { pool } from '../db.js';

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    console.log('getAllUsers called');

    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');

        console.log(rows);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener usuarios por email
export const getUserByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Buscar usuario por email
export const getBuscarNombre = async (nombre) => {
    const buscar = `%${nombre}%`;
    const result = await pool.query(
        'SELECT * FROM usuarios WHERE nombre LIKE ?',
        [buscar]
    );
    return result[0];
};

// Crear nuevo usuario 
export const postCrearUsuario = async (nombre, documento, carnet, email, contrasenia) => {
    try {
        // Se define la consulta SQL con parametros
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
            contrasenia
        ]);

        // Obtener el usuario recién creado
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [result.insertId]
        );

        return rows[0];

    } catch (err) {
        // Si ocurre error 
        throw err;
    }
};

// Actualizar usuario
export const actualizarUsuario = async (usuario, res) => {
    // Definimos la consulta SQL con parámetros
    const query = `UPDATE usuarios
        SET nombre=?,
        documento=?,
        carnet=?,
        email=?,
        contrasenia=?
        WHERE id_usuario=?`;

    try {
        // Ejecutamos la actualización
        const [result] = await pool.query(query, usuario);

        // Si no encontró usuario con ese ID
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Obtenemos el ID que viene en la posición 6 del arreglo
        const id = usuario[5];

        // Retornamos el usuario actualizado
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [id]
        );

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar usuario
export const eliminarUsuario = async (id_usuario) => {
    try {
        // Verificamos si el usuario existe
        const [usuarioAEliminar] = await pool.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [id_usuario]
        );

        // Si no existe, lanzamos un error
        if (usuarioAEliminar.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        // Si existe, ejecutamos la sentencia DELETE
        await pool.query(
            'DELETE FROM usuarios WHERE id_usuario = ?',
            [id_usuario]
        );

        // Confirmamos la eliminación
        return {
            message: 'Usuario eliminado correctamente',
            usuario: usuarioAEliminar[0]
        };
    } catch (err) {
        return { error: err.message };
    }
};