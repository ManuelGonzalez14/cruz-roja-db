import { z } from 'zod';

// Expresión regular para cédulas panameñas:
// Acepta formatos como: 8-123-4567, PE-123-456, N-12-345, E-123-456, etc.
// Exige que haya al menos dos guiones y caracteres alfanuméricos
const cedulaRegex = /^[A-Z0-9]{1,3}-[0-9]{1,4}-[0-9]{1,6}$/i;

// Expresión regular para teléfonos:
// Acepta formatos como: 61234567, 6123-4567, 234-5678, etc.
const telefonoRegex = /^[0-9]{3,4}-?[0-9]{4}$/;

export const voluntarioSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 letras").max(50, "El nombre es demasiado largo"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 letras").max(50, "El apellido es demasiado largo"),
  cedula: z.string()
    .min(5, "La cédula es demasiado corta")
    .regex(cedulaRegex, "Formato de cédula inválido. Debe incluir guiones (ej. 8-123-4567)"),
  telefono: z.string()
    .regex(telefonoRegex, "El teléfono debe tener entre 7 y 8 dígitos válidos")
    .optional()
    .or(z.literal('')), // Permite que esté vacío
  activo: z.boolean().optional(),
});
