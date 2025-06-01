// schema/models.schema.service.ts
import { z, ZodIssueCode } from 'zod';

export const schemaservicio = z.object({
  nombre: z.enum(['Barberia', 'Manicura', 'Pedicura', 'Peluqueria'], {
    errorMap: (issue, ctx) => {
      if (issue.code === ZodIssueCode.invalid_enum_value) {
        const opciones = (issue.options ?? []).join(', ');
        return {
          message: `El servicio debe ser : ${opciones}`,
        };
      }

      return { message: ctx.defaultError };
    },
  }),

  precio: z.coerce
    .number({
      invalid_type_error: 'Introduce un precio válido',
    })
    .positive('Introduce un precio válido'),

  descripcion: z.string().max(100, 'No puede exceder a 200 caracteres'),
  imagen: z.instanceof(FileList, { message: 'La imagen es requerida' }),

  duracion: z.enum(['1h']).default('1h'),
});
