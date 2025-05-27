// schema/models.schema.service.ts
import { z } from 'zod';

export const schemaservicio = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),


  precio: z.coerce
    .number({
      invalid_type_error: 'El precio debe ser un número',
    })
    .positive('El precio debe ser mayor que 0'),

  descripcion: z
    .string()
    .max(500, 'La descripción no puede exceder los 500 caracteres'),

  // RHF entrega FileList, no File
  imagen: z
    .instanceof(FileList)
    .optional()
    .refine((files) => !files || files.length <= 1, {
      message: 'Solo puedes subir una imagen',
    }),

  duracion: z.enum(['1h', '2h', '3h', '4h']).default('1h'),
});
