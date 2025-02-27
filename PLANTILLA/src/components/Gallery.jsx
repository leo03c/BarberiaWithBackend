import imgProducto1 from '../assets/Galeria1.webp';
import imgProducto2 from '../assets/Galeria2.webp';
import imgProducto3 from '../assets/Galeria3.webp';
import imgProducto4 from '../assets/Galeria4.webp';
import imgProducto5 from '../assets/Galeria5.webp';

const products = [
  {
    id: 1,
    image: imgProducto1,
  },
  {
    id: 2,
    image: imgProducto2,
  },
  {
    id: 3,
    image: imgProducto3,
  },
  {
    id: 4,
    image: imgProducto4,
  },
  {
    id: 5,
    image: imgProducto5,
  },
  {
    id: 6,
    image: 'https://via.placeholder.com/150',
  },
];

const Gallery = () => {
  return (
    <div className='bg-jetBlack text-lightGray min-h-screen py-12 pt-24'>
      <div className='max-w-7xl mx-auto px-6'>
        <h1 className='text-5xl font-bold text-center text-mustard mb-12 font-serif'>
          Galeria
        </h1>

        {/* Lista de Productos en Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {products.map((product) => (
            <div
              key={product.id}
              className='bg-lightGray rounded-lg shadow-lg hover:shadow-xl transition-all'
            >
              <img
                src={product.image}
                alt={product.name}
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
