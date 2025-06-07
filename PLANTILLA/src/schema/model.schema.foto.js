import { z } from 'zod';

export const schemafoto = z.object({
  nombre: z.string().min('Debe tener al meneos 3 caracteres'),
  imag: z.instanceof(FileList, { message: 'La imagen es requerida' }),
});
