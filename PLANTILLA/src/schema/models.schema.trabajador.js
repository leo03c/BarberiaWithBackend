import { z } from 'zod';

export const schematrabajador = z.object({
  nombre: z.string().min(3, 'EL nombre debe tener al menos 3 caracateres'),
  apellidos: z.string().min(3, 'EL apellido debe tener al menos 3 caracateres'),
  salario: z.coerce.number().positive('Introduce un salario válido'),
  puesto: z.string(),
  ci: z.string(),
});
