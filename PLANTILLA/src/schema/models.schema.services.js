// schema/models.schema.service.ts
import { z } from 'zod';

export const schemaservicio = z.object({
  nombre: z
    .string()
    .min(1, 'Campo Requerido')
    .max(50, 'Dato Incorrecto'),


  precio: z.coerce
    .number({
      invalid_type_error: 'Dato Incorrecto',
    })
    .positive('Dato Incorrecto'),

  descripcion: z
    .string()
    .max(500, 'Dato Incorrecto'),

  // RHF entrega FileList, no File
  imagen: z
    .instanceof(FileList)
    .optional()
    .refine((files) => !files || files.length <= 1, {
      message: 'Solo puedes subir una imagen',
    }),

  duracion: z.enum(['1h', '2h', '3h', '4h']).default('1h'),
});
