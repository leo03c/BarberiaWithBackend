import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useFetch } from '../hook/useFetch';

const Galeria = () => {
  const swiperRef = useRef(null);
  const url = 'http://127.0.0.1:8000/fotos/';

  const { data, isLoading, error } = useFetch(url);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>{error.message}</div>;
  
  return (
    <section id='trabajos' className='py-16 bg-white text-lightGray'>
      <div className='max-w-screen-xl mx-auto text-center'>
        <h2 className='text-4xl md:text-5xl font-serif font-bold text-mustard mb-12 animate-fade-in-up'>
          Lugares Destacados
        </h2>
        <div className='relative'>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className='absolute top-1/2 left-0 transform -translate-y-1/2 px-4 bg-mustard text-jetBlack p-2 rounded-full shadow-lg hover:bg-bronze transition-all duration-300 z-10'
          >
            <FaChevronLeft className='text-xl' />
          </button>

          <Swiper
            ref={swiperRef}
            modules={[Pagination, A11y]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {data.map((item) => (
              <SwiperSlide key={item.id}>
                <div className='relative bg-jetBlack rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105'>
                  <img
                    src={item.imag}
                    alt={`Imagen ${item.id}`}
                    className='w-full h-64 object-cover'
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className='absolute top-1/2 right-0 transform -translate-y-1/2 px-4 bg-mustard text-jetBlack p-2 rounded-full shadow-lg hover:bg-bronze transition-all duration-300 z-10'
          >
            <FaChevronRight className='text-xl' />
          </button>
        </div>
        <div className='mt-8'>
          <Link
            to='./galeria/'
            className='text-mustard font-semibold hover:text-jetBlack hover:underline transition-all duration-300'
          >
            Ver más Imágenes
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Galeria;
