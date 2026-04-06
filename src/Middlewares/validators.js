// Importamos las funciones para generar validadores (body, param, etc.)
import { body, validationResult } from 'express-validator';

/* Helper: runValidations
-Recibe un array de validaciones (pueden ser body(), param(), etc.) y las ejecuta
-Ejecuta cada validación contra la petición
-Revisa validationResult y, si hay errores, responde con un JSON de error y status 400
-Si no hay errores, llama a next() para continuar con el siguiente middleware o controlador
*/
export const runValidations = (validations) => {
    // Devolvemos un middleware estandar (req, res, next) 
    return async (req, res, next) => {
        // Iteramos cada validación y la ejecutamos contra req
        for (const validation of validations) {
            await validation.run(req);
        }

        // Obtenemos los resultados de las validaciones
        const errors = validationResult(req);

        // Si hay errores, respondemos con el siguiente middleware / controlador
        if(errors.isEmpty()) {
            return next();
        }

        // Si hay errores, respondemos con un JSON de error y status 400
        return res.status(400).json({
            status: 'error',
            errors: errors.array()
        });
    };
};

/* Validar para crear usuario (POST /users)
- nombre: obligatorio, no vacío, trim()
- email: obligatorio, formato correcto
- contrasenia: obligatorio, mínimo 6 caracteres
*/
export const createUserValidators = [
    // Validación para "nombre": quitar espacios al incio y final, no vacío
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio'),

    // Validación para "email": trim, formato correcto
    body('email')
        .trim()
        .isEmail()
        .withMessage('El email no es válido'),

    // Validación para "contrasenia": mínimo 6 caracteres
    body('contrasenia')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
];
