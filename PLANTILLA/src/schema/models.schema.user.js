import { z } from 'zod';

export const schemausuario = z.object({
  nombre: z.string().min(3, 'Campo Requerido'),
  apellidos: z.string().min(1, { message: 'Campo Requerido' }),
  usuario: z.string().min(3),
  correo: z.string().email('Ingrese un correo valido'),
  telefono: z.number().min(8, 'Debe tener al menos 8 digitos'),
  rol: z.string(),
});
