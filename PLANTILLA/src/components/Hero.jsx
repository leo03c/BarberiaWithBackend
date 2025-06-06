import { useNavigate } from 'react-router-dom';
import imgHero from '../assets/faro.jpg';
import { useAuth } from '../context/AuthContext'; 

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const handleReservationClick = () => {
    if (user) {
      navigate('/reserva');
    } else {
      navigate('/LoginForm');
    }
  };
  
  return (
    <section
      id='inicio'
      className='relative h-screen bg-cover bg-center'
      style={{
        backgroundImage: `url("${imgHero}")`,
      }}
    >
      {/* Overlay */}
      

      {/* Content */}
      <div className='relative z-10 flex flex-col justify-center h-full text-center px-6'>
        <h1 className='text-5xl text-left md:text-7xl font-serif font-bold text-white mb-6 animate-fade-in-down'>
        Paraíso Travel
        </h1>
        <h2 className='text-2xl text-left md:text-3xl font-serif font-bold text-white mb-6 animate-fade-in-down'>
        Donde cada detalle celebra su historia de amor.
        </h2>
        <p className='text-xl text-left md:text-3xl font-bold font-serif mb-8 max-w-2xl animate-fade-in-up text-white'>
         Un viaje de calidad
        </p>
        <div className='flex space-x-6'>
          <button
            onClick={handleReservationClick}
            className='bg-mustard text-slate-700 px-8 py-3 rounded-full font-semibold shadow-md hover:border-2 hover:border-mustard hover:bg-inherit hover:text-mustard transition-all duration-300'
          >
            Reserva una Cita
          </button>
          <a
            href='#trabajos'
            className='border-2 border-mustard text-mustard px-8 py-3 rounded-full font-semibold hover:bg-mustard hover:text-slate-700 transition-all duration-300'
          >
            Nuestros Destinos
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
