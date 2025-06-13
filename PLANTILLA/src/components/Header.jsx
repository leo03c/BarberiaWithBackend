import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [scrolling, setScrolling] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50  transition-all duration-300 bg-white bg-opacity-95 shadow-lg`}>
      <div className='flex justify-between items-center px-6 md:px-12 py-2'>
        <h1 className='text-2xl md:text-4xl font-serif font-bold text-mustard tracking-wider'>
          <Link to='/'>Paraíso<span className='text-sm ml-1 font-light'>Travel</span></Link>
        </h1>

        <button
          className='md:hidden text-mustard focus:outline-none'
          onClick={toggleMenu}
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

        <nav className='hidden md:block'>
          <ul className='flex space-x-4 md:space-x-8 items-center'>
            {['Inicio', 'Paquetes', 'Contacto'].map((item) => (
              <li key={item}>
                <a
                  href={`/#${item.toLowerCase()}`}
                  className='text-slate-800 uppercase text-sm md:text-base tracking-wider hover:text-mustard transition-colors duration-300'
                >
                  {item}
                </a>
              </li>
            ))}

            {/* Muestra el enlace "Admin" si el usuario está logueado y tiene rol de admin */}
            {user && user.rol === 'admin' && (
              <li>
                <Link
                  to='/dashboard/tusuario'
                  className='text-slate-800 uppercase text-sm md:text-base tracking-wider hover:text-mustard transition-colors duration-300'
                >
                  Admin
                </Link>
              </li>
            )}

            {user ? (
              <>
                <li className='text-slate-700  text-sm md:text-base font-semibold'>
                  {user.usuario}
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className='text-slate-700 border border-mustard px-3 md:px-4 py-1 md:py-2 rounded-lg text-sm md:text-base hover:bg-mustard hover:text-jetBlack transition-all duration-300'
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to='/LoginForm'
                    className='text-mustard border border-mustard px-3 md:px-4 py-1 md:py-2 rounded-lg text-sm md:text-base hover:bg-mustard hover:text-jetBlack transition-all duration-300'
                  >
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link
                    to='/clienteform'
                    className='text-jetblack bg-mustard px-3 md:px-4 py-1 md:py-2 rounded-lg text-sm md:text-base hover:bg-bronze transition-all duration-300'
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className='md:hidden bg-jetBlack bg-opacity-95 backdrop-blur-md shadow-lg absolute top-16 left-0 w-full'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ul className='flex flex-col space-y-6 items-center py-8'>
              {['Inicio', 'Paquetes', 'Contacto'].map((item) => (
                <li key={item}>
                  <a
                    href={`/#${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className='text-lightGray uppercase text-lg tracking-wider hover:text-mustard transition-colors duration-300'
                  >
                    {item}
                  </a>
                </li>
              ))}

              {user && user.rol === 'admin' && (
                <li>
                  <Link
                    to='/dashboard'
                    onClick={() => setIsOpen(false)}
                    className='text-lightGray uppercase text-sm md:text-base tracking-wider hover:text-mustard transition-colors duration-300'
                  >
                    Admin
                  </Link>
                </li>
              )}

              {user ? (
                <>
                  <li className='text-lightGray text-lg font-semibold'>
                    {user.usuario}
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className='text-lightGray border border-mustard px-4 py-2 rounded-lg text-lg hover:bg-mustard hover:text-jetBlack transition-all duration-300'
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to='/LoginForm'
                      onClick={() => setIsOpen(false)}
                      className='text-lightGray border border-mustard px-4 py-2 rounded-lg text-lg hover:bg-mustard hover:text-jetBlack transition-all duration-300'
                    >
                      Iniciar sesión
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/clienteform'
                      onClick={() => setIsOpen(false)}
                      className='text-lightGray bg-mustard px-4 py-2 rounded-lg text-lg hover:bg-bronze transition-all duration-300'
                    >
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
