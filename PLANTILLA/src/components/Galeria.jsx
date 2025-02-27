import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import imgProducto1 from '../assets/Galeria1.webp';
import imgProducto2 from '../assets/Galeria2.webp';
import imgProducto3 from '../assets/Galeria3.webp';
import imgProducto4 from '../assets/Galeria4.webp';
import { Link } from 'react-router-dom';

const Galeria = () => {
  const products = [
    {
      image: imgProducto1,
    },
    {
      image: imgProducto2,
    },
    {
      image: imgProducto3,
    },
    {
      image: imgProducto4,
    },
  ];

  return (
    <section id='productos' className='py-16 bg-jetBlack text-lightGray'>
      <div className='max-w-screen-xl mx-auto text-center'>
        <h2 className='text-4xl md:text-5xl font-serif font-bold text-mustard mb-12 animate-fade-in-up'>
          Galeria de Trabajos Destacados
        </h2>
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <div className='relative bg-jetBlack rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105'>
                <img
                  src={product.image}
                  alt={`Producto ${index + 1}`}
                  className='w-full h-64 object-cover'
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='mt-8'>
          <Link
            to='./galeria/'
            className='text-mustard font-semibold hover:text-jetBlack hover:underline transition-all duration-300'
          >
            Ver más Imagenes
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Galeria;
