import { useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { GetAllPromociones } from '../api/PromocionesApi';
import { CalcularPorCiento } from '../hook/porCiento';
import { useService } from '../hook/reactQuery/useService ';

const Services = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { useGetAllService } = useService();

  const { data: AllPromotions = [], isLoading } = GetAllPromociones();
  const { data: AllServices = [] } = useGetAllService();

  const promoByServiceId = useMemo(() => {
    const map = new Map();
    AllPromotions.forEach((p) => {
      if (p?.servicio?.id != null) map.set(p.servicio.id, p);
    });
    return map;
  }, [AllPromotions]);

  console.log(promoByServiceId);

  if (isLoading) return <div>Cargando…</div>;
  if (!AllServices.length) return <div>No hay servicios disponibles.</div>;

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % AllServices.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + AllServices.length) % AllServices.length
    );

  return (
    <section id='servicios' className='py-16 bg-jetBlack text-lightGray'>
      <div className='max-w-screen-xl mx-auto text-center'>
        <h2 className='text-4xl md:text-5xl font-serif font-bold text-mustard mb-12 animate-fade-in-up'>
          Nuestros Servicios
        </h2>

        <div className='relative'>
          {/* Carrusel */}
          <div className='overflow-hidden rounded-lg shadow-lg'>
            <motion.div
              className='flex'
              animate={{ x: -currentSlide * 100 + '%' }}
              transition={{ type: 'tween', duration: 0.5 }}
            >
              {AllServices.map((service) => {
                const promotion = promoByServiceId.get(service.id);

                const precioConDescuento = promotion
                  ? CalcularPorCiento(service.precio, promotion.porcientoDesc)
                  : service.precio;

                return (
                  <div key={service.id} className='w-full flex-shrink-0'>
                    <motion.img
                      src={service.imagen}
                      alt={service.nombre}
                      className='w-full h-[500px] object-cover object-center rounded-lg'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />

                    <div className='p-6'>
                      <h3 className='text-2xl font-serif font-semibold text-mustard mb-4'>
                        {service.nombre}
                      </h3>
                      <p className='text-lg text-lightGray mb-4'>
                        {service.descripcion}
                      </p>
                      <p
                        className={`text-lg text-mustard mb-4 ${
                          promotion ? 'line-through ' : ''
                        }`}
                      >
                        Precio:&nbsp;{service.precio}
                      </p>
                      <p>
                        {promotion ? (
                          <span className='text-lg font-bold text-mustard'>
                            Precio con Descuento:&nbsp;
                            {precioConDescuento}
                          </span>
                        ) : (
                          ''
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Botones */}
          <button
            onClick={prevSlide}
            className='absolute top-1/2 left-0 -translate-y-1/2 px-4 bg-mustard text-jetBlack p-2 rounded-full shadow-lg hover:bg-bronze transition-all duration-300'
          >
            <FaChevronLeft className='text-xl' />
          </button>
          <button
            onClick={nextSlide}
            className='absolute top-1/2 right-0 -translate-y-1/2 px-4 bg-mustard text-jetBlack p-2 rounded-full shadow-lg hover:bg-bronze transition-all duration-300'
          >
            <FaChevronRight className='text-xl' />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
