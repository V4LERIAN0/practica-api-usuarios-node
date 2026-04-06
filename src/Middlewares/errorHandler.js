export const errorHandler = (err, req, res, next) => {
    // Mostramos el error en la consola para depuración
    console.error(err)

    // Si el error tiene un status definido se usa, si no, asignamos 500 (Error Interno del Servidor)
    const statusCode = err.statusCode || 500;

    // Igual con el mensaje, si el error tiene un mensaje definido se usa, si no, asignamos un mensaje genérico
    const message = err.message || 'Error Interno del Servidor';

    // Repspondemos con un JSON uniforme
    res.status(statusCode).json({ 
        status : 'error', 
        message 
    });
};