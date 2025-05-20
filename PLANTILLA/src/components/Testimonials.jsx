// src/components/Testimonials.jsx
import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ModalNotification } from './Modal';

const testimonialSchema = z.object({
  comentario: z
    .string()
    .min(10, 'El comentario debe tener al menos 10 caracteres'),
  clasificacion: z
    .number({ invalid_type_error: 'La clasificación debe ser un número' })
    .min(1, 'La clasificación mínima es 1')
    .max(5, 'La clasificación máxima es 5'),
});

const userid = localStorage.getItem('id');
const username = localStorage.getItem('username');

const Testimonials = () => {
  const [showModal, setShowModal] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    usuarioid: userid,
    comentario: '',
    clasificacion: 5,
  });
  const [formErrors, setFormErrors] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // 1) Función para obtener todas las reseñas
  const fetchTestimonials = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/reseñas/');
      if (!res.ok) throw new Error('Error al cargar reseñas');
      const data = await res.json();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 2) Llamamos a fetchTestimonials al montar
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // 3) Rotación automática
  useEffect(() => {
    if (!testimonials.length) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: name === 'clasificacion' ? parseInt(value, 10) : value,
    }));
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const safeUsername = username || 'Usuario';
    const comentarioConUsuario = `${safeUsername}: ${formData.comentario}`;

    // Validación
    try {
      testimonialSchema.parse({
        comentario: comentarioConUsuario,
        clasificacion: formData.clasificacion,
      });
    } catch (zErr) {
      const errs = {};
      zErr.errors.forEach(({ path, message }) => {
        errs[path[0]] = message;
      });
      setFormErrors(errs);
      return;
    }

    // Envío
    try {
      const res = await fetch('http://localhost:8000/api/reseñas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioid: formData.usuarioid,
          comentario: comentarioConUsuario,
          clasificacion: formData.clasificacion,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        setShowModal(true);
        return;
      }
      if (!res.ok) {
        console.error('Error al enviar:', await res.json());
        return;
      }

      // Éxito: resetea form y recarga todas las reseñas
      setFormData({ usuarioid: userid, comentario: '', clasificacion: 5 });
      fetchTestimonials();
    } catch (err) {
      console.error('Error inesperado:', err);
    }
  };

  return (
    <section
      id='testimonios'
      className='bg-jetBlack text-lightGray py-16 px-6 md:px-16'
    >
      <ModalNotification
        color='#f44336'
        message='Debes estar autenticado primero'
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />

      <h2 className='text-4xl md:text-5xl font-serif font-bold text-mustard mb-12 text-center tracking-wide'>
        Reseña de Nuestros Clientes
      </h2>

      <div className='flex flex-col lg:flex-row justify-center items-center gap-12'>
        {/* Carrusel de testimonios */}
        <div className='w-full lg:w-1/2'>
          {testimonials.length ? (
            <div className='overflow-hidden rounded-2xl shadow-xl bg-jetBlack p-8 flex items-center justify-center'>
              <motion.div
                key={testimonials[currentTestimonial].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1 }}
                className='text-center'
              >
                <p className='text-lg italic mb-6'>
                  {testimonials[currentTestimonial].comentario}
                </p>
                <div className='flex justify-center'>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < testimonials[currentTestimonial].clasificacion
                          ? 'text-mustard'
                          : 'text-gray-400'
                      }
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <p>Cargando Reseña...</p>
          )}
        </div>

        {/* Formulario de nueva reseña */}
        <div className='w-full lg:w-1/2 bg-jetBlack p-8 rounded-2xl shadow-xl'>
          <h3 className='text-2xl font-serif font-bold text-mustard mb-6 text-center tracking-wide'>
            Deja tu Reseña
          </h3>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div>
              <label htmlFor='comentario' className='block mb-2 font-semibold'>
                Comentario:
              </label>
              <textarea
                id='comentario'
                name='comentario'
                value={formData.comentario}
                onChange={handleChange}
                rows='5'
                className='w-full p-4 rounded-lg bg-gray-800'
                placeholder='Escribe tu testimonio...'
              />
              {formErrors.comentario && (
                <p className='text-red-500 mt-2'>{formErrors.comentario}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='clasificacion'
                className='block mb-2 font-semibold'
              >
                Clasificación:
              </label>
              <select
                id='clasificacion'
                name='clasificacion'
                value={formData.clasificacion}
                onChange={handleChange}
                className='w-full p-4 rounded-lg bg-gray-800'
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              {formErrors.clasificacion && (
                <p className='text-red-500 mt-2'>{formErrors.clasificacion}</p>
              )}
            </div>

            <button
              type='submit'
              className='bg-mustard text-jetBlack p-4 rounded-xl hover:bg-bronze transition mt-6'
            >
              Enviar Reseña
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
