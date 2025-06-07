import { useEffect } from 'react';
import { GetAllPhoto } from '../api/GaleriaApi';

const Gallery = () => {
  const { data: AllPhotos = [] } = GetAllPhoto();

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className='bg-jetBlack text-lightGray min-h-screen py-12 pt-24'>
      <div className='max-w-7xl mx-auto px-6'>
        <h1 className='text-5xl font-bold text-center text-mustard mb-12 font-serif'>
          Galeria
        </h1>

        {/* Lista de Productos en Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {AllPhotos.map((data) => (
            <div
              key={data.id}
              className='bg-lightGray rounded-lg shadow-lg hover:shadow-xl transition-all'
            >
              <img
                src={data.imag}
                alt={data.name}
                className='w-full h-52 object-cover'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
