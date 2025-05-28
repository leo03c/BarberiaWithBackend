import { z } from 'zod';
export const productoSchema = z.object({
  nombre: z.string().min(1, 'Campo Requerido').max(50, 'Dato Incorrecto'),
  precio: z.coerce
    .number({
      invalid_type_error: 'Campo Incorrecto',
    })
    .positive('Campo Incorrecto'),
  cantidad: z.coerce
    .number({
      invalid_type_error: 'Campo Incorrecto',
    })
    .positive('Campo Incorrecto'),
});
