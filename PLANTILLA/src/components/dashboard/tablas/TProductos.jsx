// TProductos.jsx
import { useState, useEffect } from 'react';
import {
  Pencil,
  Trash2,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const API_URL = 'http://localhost:8000/api/productos/';
const ITEMS_PER_PAGE = 5;

const TProductos = () => {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nombre: formData.nombre,
      precio: parseFloat(formData.precio),
      cantidad: parseInt(formData.cantidad),
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}${editingId}/` : API_URL;

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setEditingId(null);
      setFormData({ nombre: '', precio: '', cantidad: '' });
      fetchProductos();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  const handleEdit = (producto) => {
    setEditingId(producto.id);
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad,
    });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = productos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productos.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20'>
      <h2 className='text-3xl font-serif font-bold text-mustard mb-6'>
        Gestión de Productos
      </h2>

      <form
        onSubmit={handleSubmit}
        className='bg-gray-800 p-4 rounded-lg shadow mb-6'
      >
        <div className='grid grid-cols-3 gap-4'>
          <input
            type='text'
            name='nombre'
            placeholder='Nombre del producto'
            value={formData.nombre}
            onChange={handleInputChange}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
            required
          />
          <input
            type='number'
            step='0.01'
            name='precio'
            placeholder='Precio'
            value={formData.precio}
            onChange={handleInputChange}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
            required
          />
          <input
            type='number'
            name='cantidad'
            placeholder='Cantidad'
            value={formData.cantidad}
            onChange={handleInputChange}
            className='p-2 bg-gray-700 text-lightGray rounded-md'
            required
          />
        </div>
        <button
          type='submit'
          className='mt-4 w-full bg-mustard text-jetBlack py-2 rounded-lg font-semibold flex items-center justify-center gap-2'
        >
          <PlusCircle size={18} />
          {editingId ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
      </form>

      <div className='overflow-x-auto'>
        <table className='w-full bg-gray-800 rounded-lg'>
          <thead>
            <tr className='text-mustard'>
              <th className='py-2 px-4 text-left'>Producto</th>
              <th className='py-2 px-4 text-left'>Precio</th>
              <th className='py-2 px-4 text-left'>Cantidad</th>
              <th className='py-2 px-4 text-center'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((producto) => (
              <tr
                key={producto.id}
                className='border-t border-gray-700 hover:bg-gray-700 transition'
              >
                <td className='py-2 px-4'>{producto.nombre}</td>
                <td className='py-2 px-4'>${producto.precio}</td>
                <td className='py-2 px-4'>{producto.cantidad}</td>
                <td className='py-2 px-4 flex justify-center gap-3'>
                  <button
                    onClick={() => handleEdit(producto)}
                    className='text-mustard hover:text-yellow-500 transition'
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(producto.id)}
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

export default TProductos;
