import { useState } from 'react';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { GetAllResennas, useDeleteResennas } from '../../../api/ResennaApi';
import ConfirmationModal from '../../../ui/confirmGeneric';

const ITEMS_PER_PAGE = 5;

const TResennas = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: AllResennas = [] } = GetAllResennas();
  const { mutate: deleteResennas } = useDeleteResennas();
  const [id, setId] = useState();
  const [open, SetOpen] = useState();

  // Calcular reseñas para la página actual
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = AllResennas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(AllResennas.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20'>
      <h2 className='text-3xl font-serif font-bold text-mustard mb-6'>
        Gestión de Reseñas
      </h2>

      {/* Formulario de reseña */}

      {/* Tabla de reseñas */}
      <div className='overflow-x-auto'>
        <table className='w-full bg-gray-800 rounded-lg'>
          <thead>
            <tr className='text-mustard'>
              <th className='py-2 px-4 text-left'>Usuario</th>
              <th className='py-2 px-4 text-left'>Clasificación</th>
              <th className='py-2 px-4 text-left'>Comentario</th>
              <th className='py-2 px-4 text-center'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((reseña) => {
              return (
                <tr
                  key={reseña.id}
                  className='border-t border-gray-700 hover:bg-gray-700 transition'
                >
                  <td className='py-2 px-4'>{reseña.usuarioid}</td>
                  <td className='py-2 px-4'>{reseña.clasificacion}</td>
                  <td className='py-2 px-4'>{reseña.comentario}</td>
                  <td className='py-2 px-4 flex justify-center gap-3'>
                    <button
                      onClick={() => {
                        setId(reseña.id);
                        SetOpen(true);
                      }}
                      className='text-red-500 hover:text-red-400 transition'
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
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

        <ConfirmationModal
          isOpen={open}
          title={'Confirmar Eliminación'}
          message='¿Estás seguro de que deseas eliminar esta reseña?'
          onConfirm={() => {
            deleteResennas(id);
            SetOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default TResennas;
