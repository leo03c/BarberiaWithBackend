import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Por favor, complete ambos campos.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || 'Usuario o contraseña incorrectos.');
        return;
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      login(formData.username); // Inicia sesión en el contexto
      // const role = localStorage.getItem('rol');
      // if (role === 'admin') {
      //   navigate('/dashboard');
      // } else {
        // navigate('/'); // Ruta del home para clientes
      // }
          navigate('/')
    } catch (err) {
      setError('Hubo un problema. Inténtelo de nuevo.');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className='min-h-screen bg-jetBlack py-16 px-6 flex items-center justify-center'>
      <motion.div
        className='max-w-md w-full bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl p-8'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className='text-4xl text-mustard font-serif font-bold text-center mb-10'>
          Iniciar Sesión
        </h2>

        {error && (
          <p className='text-center text-red-400 font-semibold mb-4'>{error}</p>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              className='block text-lightGray font-medium mb-2'
              htmlFor='username'
            >
              Usuario
            </label>
            <input
              type='text'
              name='username'
              id='username'
              value={formData.username}
              onChange={handleChange}
              className='w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mustard transition-all'
              required
            />
          </div>

          <div>
            <label
              className='block text-lightGray font-medium mb-2'
              htmlFor='password'
            >
              Contraseña
            </label>
            <input
              type='password'
              name='password'
              id='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mustard transition-all'
              required
            />
          </div>
          <div className='flex justify-center'>
            <button className='bg-mustard  text-jetBlack font-bold py-4 px-8 rounded-lg'>
              Iniciar Sesión
            </button>
          </div>
          <div className='flex justify-center'>
            <Link to={'/clienteform'} className='text-lightGray  py-6  '>
              No tengo una cuenta
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginForm;
