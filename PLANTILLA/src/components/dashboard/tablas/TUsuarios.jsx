import { useState, useEffect } from 'react';
import ConfirmationModal from '../../../ui/confirmGeneric';
import toast, { Toaster } from 'react-hot-toast';
import {
  Pencil,
  Trash2,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { GetAllUser } from '../../../api/UsuarioApi';
import { useForm } from 'react-hook-form';
import { schemausuario } from '../../../schema/models.schema.user';
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from '../../../hook/reactQuery/useUsuario';
import { Toaster } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import ConfirmationModal from '../../../ui/confirmGeneric';

const ITEMS_PER_PAGE = 5;

const TUsuarios = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemausuario),
  });

  const { data: AllUser = [] } = GetAllUser();
  const { mutate: createUserMutate } = useCreateUser();
  const { mutate: updateUserMutate } = useUpdateUser();
  const { mutate: deleteUserMutate } = useDeleteUser();

  const [editingId, setEditingId] = useState(null);

  const onSubmit = (data) => {
    if (editingId) {
      try{
      updateUserMutate({ id: editingId, data: data });
      reset({
        nombre: '',
        apellidos: '',
        correo: '',
        telefono: '',
        rol: '',
        usuario: '',
      });
      fetchUsuarios(); // Refrescar la lista
      toast.success('Usuario registrado')
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      toast.error('Error al registrar')
      return;
    }

    createUserMutate({ password: 123456, ...data });
    reset();
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData(user);
  };

  const handleDelete = async (id) => {
    try {
      reset({
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
        telefono: user.telefono,
        usuario: user.usuario,
        rol: user.rol,
      });
      toast.success('Usuario eliminado')
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  // Calcular usuarios para la página actual
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = AllUser.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(AllUser.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20'>
      <Toaster/>
      <h2 className='text-3xl font-serif font-bold text-mustard mb-6'>
        Gestión de Usuarios
      </h2>

      {/* Formulario de Usuario */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-gray-800 p-4 rounded-lg shadow mb-6'
      >
        <Toaster />
        <div className='grid grid-cols-2 gap-4'>
          <input
            type='text'
            name='nombre'
            placeholder='Nombre'
            {...register('nombre')}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
          />

          {errors.nombre && (
            <span className='text-red-500'> {errors.message.nombre}</span>
          )}

          <input
            id='apellidos'
            type='text'
            name='apellidos'
            placeholder='Apellidos'
            {...register('apellidos')}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
          />
          {errors.apellidos && (
            <span className='text-red-500'> {errors.message.apellidos}</span>
          )}
          <input
            id='usuario'
            type='text'
            name='usuario'
            placeholder='Usuario'
            {...register('usuario')}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
            required
          />
          {errors.usuario && (
            <span className='text-red-500'> {errors.message.usuario}</span>
          )}
          <input
            type='email'
            name='correo'
            placeholder='Correo'
            {...register('correo')}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
            required
          />
          {errors.correo && (
            <span className='text-red-500'> {errors.message.correo}</span>
          )}
          <input
            type='tel'
            name='telefono'
            placeholder='Teléfono'
            {...register('telefono')}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
            required
          />

          {errors.telefono && (
            <span className='text-red-500'> {errors.message.telefono}</span>
          )}

          {/* Selector de rol */}
          <select
            name='rol'
            {...register('rol')}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
          >
            <option value='cliente'>Cliente</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
        <button
          type='submit'
          className='mt-4 w-full bg-mustard text-jetBlack py-2 rounded-lg font-semibold flex items-center justify-center gap-2'
        >
          <PlusCircle size={18} />
          {editingId ? 'Actualizar Usuario' : 'Agregar Usuario'}
        </button>
      </form>

      {/* Tabla de Usuarios */}
      <div className='overflow-x-auto'>
        <table className='w-full bg-gray-800 rounded-lg'>
          <thead>
            <tr className='text-mustard'>
              <th className='py-2 px-4 text-left'>ID</th>
              <th className='py-2 px-4 text-left'>Nombre</th>
              <th className='py-2 px-4 text-left'>Usuario</th>
              <th className='py-2 px-4 text-left'>Correo</th>
              <th className='py-2 px-4 text-left'>Teléfono</th>
              <th className='py-2 px-4 text-left'>Rol</th>
              <th className='py-2 px-4 text-center'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr
                key={user.id}
                className='border-t border-gray-700 hover:bg-gray-700 transition'
              >
                <td className='py-2 px-4'>{user.id}</td>
                <td className='py-2 px-4'>
                  {user.nombre} {user.apellidos}
                </td>
                <td className='py-2 px-4'>{user.usuario}</td>
                <td className='py-2 px-4'>{user.correo}</td>
                <td className='py-2 px-4'>{user.telefono}</td>
                <td className='py-2 px-4'>{user.rol}</td>
                <td className='py-2 px-4 flex justify-center gap-3'>
                  <button
                    onClick={() => handleEdit(user)}
                    className='text-mustard hover:text-yellow-500 transition'
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setIsopen(true);
                      setEditingId(user.id);
                    }}
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

      {/* Controles de Paginación */}
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
        {isOpen && (
          <ConfirmationModal
            isOpen={isOpen}
            title='Confirmar Eliminación'
            message='¿Estás seguro de que deseas eliminar este usuario?'
            onConfirm={() => {
              deleteUserMutate(editingId);
              setIsopen(false);
            }}
            onCancel={() => setIsopen(false)}
          />
        )}
      </div>
      {isOpen && (
        <ConfirmationModal
          isOpen={isOpen}
          title='Confirmar Eliminación'
          message='¿Estás seguro de que deseas eliminar este servicio?'
          onConfirm={() => {
            handleDelete(usuarioToDelete);
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}};

export default TUsuarios;
