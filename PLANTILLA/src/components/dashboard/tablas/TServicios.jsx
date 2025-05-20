import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Pencil,
  Trash2,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const API_URL = 'https://9pqf8mms-8000.use2.devtunnels.ms/api/servicios/';
const ITEMS_PER_PAGE = 5;

// Schema de validación con Zod
const servicioSchema = z.object({
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
  imag: z
    .any()
    .refine((files) => {
      // Si llegó algo, que sea FileList o array
      return (
        files == null ||
        files.length === 0 ||
        (files.length > 0 && files[0] instanceof File)
      );
    }, 'Archivo no válido')
    .optional(),
});

const TServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      nombre: '',
      precio: '',
      descripcion: '',
      imag: null,
    },
  });

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setServicios(data);
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('precio', data.precio.toString());
    formData.append('descripcion', data.descripcion);
    if (data.imag && data.imag.length > 0) {
      formData.append('imag', data.imag[0]);
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}${editingId}/` : API_URL;
      await fetch(url, { method, body: formData });

      setEditingId(null);
      reset();
      fetchServicios();
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
    }
  };

  const handleEdit = (servicio) => {
    setEditingId(servicio.id);
    reset({
      nombre: servicio.nombre,
      precio: servicio.precio,
      descripcion: servicio.descripcion,
      imag: null,
    });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      fetchServicios();
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = servicios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(servicios.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className='bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20'>
      <h2 className='text-3xl font-serif font-bold text-mustard mb-6'>
        Gestión de Servicios
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-gray-800 p-4 rounded-lg shadow mb-6'
      >
        <div className='grid grid-cols-2 gap-4'>
          {/* Nombre */}
          <div>
            <input
              type='text'
              placeholder='Nombre del servicio'
              {...register('nombre')}
              className='p-2 bg-gray-700 text-lightGray rounded-md w-full'
            />
            {errors.nombre && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Precio */}
          <div>
            <input
              type='number'
              step='0.01'
              placeholder='Precio'
              {...register('precio')}
              className='p-2 bg-gray-700 text-lightGray rounded-md w-full'
            />
            {errors.precio && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.precio.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className='col-span-2'>
            <textarea
              placeholder='Descripción'
              {...register('descripcion')}
              className='p-2 bg-gray-700 text-lightGray rounded-md w-full'
            />
            {errors.descripcion && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.descripcion.message}
              </p>
            )}
          </div>

          {/* Imagen */}
          <div>
            <input
              type='file'
              accept='image/*'
              {...register('imag')}
              className='p-2 bg-gray-700 text-lightGray rounded-md w-full'
            />
            {errors.imag && (
              <p className='text-red-500 text-sm mt-1'>{errors.imag.message}</p>
            )}
          </div>
        </div>

        <button
          type='submit'
          className='mt-4 w-full bg-mustard text-jetBlack py-2 rounded-lg font-semibold flex items-center justify-center gap-2'
        >
          <PlusCircle size={18} />
          {editingId ? 'Actualizar Servicio' : 'Agregar Servicio'}
        </button>
      </form>

      <div className='overflow-x-auto'>
        <table className='w-full bg-gray-800 rounded-lg'>
          <thead>
            <tr className='text-mustard'>
              <th className='py-2 px-4 text-left'>Imagen</th>
              <th className='py-2 px-4 text-left'>Servicio</th>
              <th className='py-2 px-4 text-left'>ID</th>
              <th className='py-2 px-4 text-left'>Precio</th>
              <th className='py-2 px-4 text-left'>Descripción</th>
              <th className='py-2 px-4 text-center'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((servicio) => (
              <tr
                key={servicio.id}
                className='border-t border-gray-700 hover:bg-gray-700 transition'
              >
                <td className='py-2 px-4'>
                  {servicio.imag && (
                    <img
                      src={servicio.imag}
                      alt={servicio.nombre}
                      className='h-12 w-12 object-cover rounded-md'
                    />
                  )}
                </td>
                <td className='py-2 px-4'>{servicio.nombre}</td>
                <td className='py-2 px-4'>{servicio.id}</td>
                <td className='py-2 px-4'>${servicio.precio}</td>
                <td className='py-2 px-4'>{servicio.descripcion}</td>
                <td className='py-2 px-4 flex justify-center gap-3'>
                  <button
                    onClick={() => handleEdit(servicio)}
                    className='text-mustard hover:text-yellow-500 transition'
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(servicio.id)}
                    className='text-red-500 hover:text-red-400 transition'
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-center items-center gap-4 mt-4'>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-mustard text-jetBlack hover:bg-yellow-500'
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <span className='text-lightGray'>
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-mustard text-jetBlack hover:bg-yellow-500'
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default TServicios;
