import { z } from 'zod';

export const schemausuario = z.object({
  nombre: z.string().min(3, 'Campo Requerido'),
  apellidos: z.string().min(1, { message: 'Campo Requerido' }),
  usuario: z.string().min(3),
  correo: z.string().email('Campo Incorrecto'),
  telefono: z.string().min(8, 'Campo Incorrecto'),
  rol: z.string(),
});
