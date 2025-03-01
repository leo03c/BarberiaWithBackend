import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

// ✅ Esquema de validación con Zod
const schema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  apellidos: z
    .string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres.'),
  usuario: z.string().min(3, 'El usuario debe tener al menos 3 caracteres.'),
  correo: z.string().email('Ingrese un correo válido.'),
  telefono: z
    .string()
    .regex(/^\d{8,10}$/, 'El teléfono debe tener entre 8 y 10  dígitos.')
    .optional(),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

const ClienteForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const generarEnlace = (usuario) => {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return (
      usuario +
      Array.from({ length: 7 }, () =>
        caracteres.charAt(Math.floor(Math.random() * caracteres.length))
      ).join('')
    );
  };

  const onSubmit = async (formData) => {
    try {
      const enlaceGenerado = generarEnlace(formData.usuario);
      const dataToSend = {
        ...formData,
        telefono: formData.telefono || null,
        enlace: enlaceGenerado,
      };

      const response = await fetch('http://127.0.0.1:8000/api/registro/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar cliente.');
      }

      setTimeout(() => navigate('/'), 1000);
      reset();
    } catch (error) {
      console.log(`Hubo un problema: ${error.message}`);
    }
  };

  return (
    <div className='min-h-screen bg-jetBlack py-16 px-6 flex items-center justify-center'>
      <motion.div
        className='max-w-4xl w-full bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl p-8'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className='text-4xl text-mustard font-serif font-bold text-center mb-10'>
          Registro de Cliente
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid grid-cols-1 md:grid-cols-2 gap-6'
        >
          <div>
            <label className='block text-lightGray font-medium mb-2'>
              Nombre
            </label>
            <input
              {...register('nombre')}
              className='w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mustard transition-all'
              placeholder='Ej: Juan'
            />
            {errors.nombre && (
              <p className='text-red-400 text-sm'>{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className='block text-lightGray font-medium mb-2'>
              Apellidos
            </label>
            <input
              {...register('apellidos')}
              className='w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray focus:outline-none focus:ring-2 focus:ring-mustard transition-all'
              placeholder='Ej: Pérez'
            />
            {errors.apellidos && (
              <p className='text-red-400 text-sm'>{errors.apellidos.message}</p>
            )}
          </div>

          <div>
            <label className='block text-lightGray font-medium mb-2'>
              Usuario
            </label>
            <input
              {...register('usuario')}
              className='w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray focus:outline-none focus:ring-2 focus:ring-mustard transition-all'
              placeholder='Ej: juan123'
            />
            {errors.usuario && (
              <p className='text-red-400 text-sm'>{errors.usuario.message}</p>
            )}
          </div>

          <div>
            <label className='block text-lightGray font-medium mb-2'>
              Correo Electrónico
            </label>
            <input
              {...register('correo')}
              className='w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray focus:outline-none focus:ring-2 focus:ring-mustard transition-all'
              placeholder='Ej: correo@ejemplo.com'
            />
            {errors.correo && (
              <p className='text-red-400 text-sm'>{errors.correo.message}</p>
            )}
          </div>

          <div>
            <label className='block text-lightGray font-medium mb-2'>
              Teléfono
            </label>
            <input
              {...register('telefono')}
              className='w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray focus:outline-none focus:ring-2 focus:ring-mustard transition-all'
              placeholder='Ej: 56870848'
            />
            {errors.telefono && (
              <p className='text-red-400 text-sm'>{errors.telefono.message}</p>
            )}
          </div>

          <div>
            <label className='block text-lightGray font-medium mb-2'>
              Contraseña
            </label>
            <input
              type='password'
              {...register('password')}
              className='w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray focus:outline-none focus:ring-2 focus:ring-mustard transition-all'
              placeholder='Mínimo 6 caracteres'
            />
            {errors.password && (
              <p className='text-red-400 text-sm'>{errors.password.message}</p>
            )}
          </div>

          <div className='md:col-span-2 flex justify-center'>
            <button
              type='submit'
              className='bg-mustard text-jetBlack font-bold py-4 px-8 rounded-lg shadow-md hover:bg-bronze hover:text-lightGray transition-all duration-300'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ClienteForm;
