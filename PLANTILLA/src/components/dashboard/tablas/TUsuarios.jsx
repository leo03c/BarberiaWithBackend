import { useState, useEffect } from 'react';
import {
  Pencil,
  Trash2,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const API_URL = 'http://localhost:8000/api/usuarios/';
const ITEMS_PER_PAGE = 5;

const TUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    usuario: '',
    correo: '',
    telefono: '',
    rol: 'cliente',
    password: '123456',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}${editingId}/` : API_URL;

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setEditingId(null);
      setFormData({
        nombre: '',
        apellidos: '',
        usuario: '',
        correo: '',
        telefono: '',
        rol: 'cliente',
      });
      fetchUsuarios(); // Refrescar la lista
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData(user);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      fetchUsuarios(); // Actualizar lista
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  // Calcular usuarios para la página actual
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = usuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(usuarios.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20'>
      <h2 className='text-3xl font-serif font-bold text-mustard mb-6'>
        Gestión de Usuarios
      </h2>

      {/* Formulario de Usuario */}
      <form
        onSubmit={handleSubmit}
        className='bg-gray-800 p-4 rounded-lg shadow mb-6'
      >
        <div className='grid grid-cols-2 gap-4'>
          <input
            type='text'
            name='nombre'
            placeholder='Nombre'
            value={formData.nombre}
            onChange={handleInputChange}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
            required
          />
          <input
            type='text'
            name='apellidos'
            placeholder='Apellidos'
            value={formData.apellidos}
            onChange={handleInputChange}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
            required
          />
          <input
            type='text'
            name='usuario'
            placeholder='Usuario'
            value={formData.usuario}
            onChange={handleInputChange}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
            required
          />
          <input
            type='email'
            name='correo'
            placeholder='Correo'
            value={formData.correo}
            onChange={handleInputChange}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
            required
          />
          <input
            type='tel'
            name='telefono'
            placeholder='Teléfono'
            value={formData.telefono}
            onChange={handleInputChange}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
            required
          />

          {/* Selector de rol */}
          <select
            name='rol'
            value={formData.rol}
            onChange={handleInputChange}
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
                    onClick={() => handleDelete(user.id)}
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
      </div>
    </div>
  );
};

export default TUsuarios;
