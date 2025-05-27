import { z } from 'zod';
export const productoSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  precio: z.coerce
    .number({
      invalid_type_error: 'El precio debe ser un número',
    })
    .positive('El precio debe ser mayor que 0'),
  cantidad: z.coerce
    .number({
      invalid_type_error: 'El precio debe ser un número',
    })
    .positive('El precio debe ser mayor que 0'),
});
