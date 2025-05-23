import { z } from 'zod';

export const servicioSchema = z.object({
  nombre: z.string().nonempty('El nombre es requerido'),
  precio: z.preprocess(
    (val) => {
      if (typeof val === 'string') return parseFloat(val);
      return val;
    },
    z
      .number({
        required_error: 'El precio es requerido',
        invalid_type_error: 'El precio debe ser un número',
      })
      .min(0, 'El precio no puede ser negativo')
  ),
  descripcion: z.string().nonempty('La descripción es requerida'),
  imagen: z
    .any()
    .refine((files) => {
      return (
        files == null ||
        files.length === 0 ||
        (files.length > 0 && files[0] instanceof File)
      );
    }, 'Archivo no válido')
    .optional(),
});

