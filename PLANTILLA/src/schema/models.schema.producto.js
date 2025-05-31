import { z } from 'zod';
export const productoSchema = z.object({
  nombre: z.string(),
  precio: z.coerce
    .number({
      invalid_type_error: 'Introduce un precio valido ',
    })
    .positive('Introduce un precio valido'),
  cantidad: z.coerce
    .number({
      invalid_type_error: 'Introduce una cantidad  valida',
    })
    .positive('Introduce un cantidad  valida'),
});
