import {z} from 'zod';
export const productoSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  precio: z
    .number()
    .min(0.01, 'El precio debe ser mayor a 0')
    .max(10000, 'El precio no puede exceder los 10000'),
  descripcion: z.string().max(500, 'La descripción no puede exceder los 500 caracteres'),
  imagen: z.instanceof(File).optional(),
  duracion: z.enum(['1h', '2h', '3h', '4h']).default('1h'),
});