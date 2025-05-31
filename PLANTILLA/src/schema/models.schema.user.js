import { z } from 'zod';

export const schemausuario = z.object({
  nombre: z.string(),
  apellidos: z.string(),
  usuario: z.string(),
  correo: z.string().email('Ingrese un correo válido.'),
  telefono: z.coerce
    .number()
    .min(8, 'El teléfono debe tener entre 8 y 10  dígitos.'),
});
