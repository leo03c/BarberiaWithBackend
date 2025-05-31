import { z } from 'zod';

export const schematrabajador = z.object({
  nombre: z.string(),
  apellidos: z.string(),
  salario: z.coerce.number().positive('Introduce un salario valido'),
  puesto: z.string(),
  ci: z.string(),
});
