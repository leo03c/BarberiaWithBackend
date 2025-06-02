import { z } from 'zod';

export const schemafoto = z.object({
  nombre: z.string(),
  imag: z.instanceof(FileList, { message: 'La imagen es requerida' }),
});
