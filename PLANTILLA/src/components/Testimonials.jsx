import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import { z } from 'zod';

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
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState({
    usuarioid: userid,
    comentario: '',
    clasificacion: 5,
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/reseñas/');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };
  
  useEffect(() => {
    fetchTestimonials();
  }, []);
  

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'clasificacion' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const safeUsername = username || "Usuario"; // Evitar valores nulos
      const comentarioConUsuario = `${safeUsername}: ${formData.comentario}`;
  
      // Validar con Zod
      testimonialSchema.parse({
        comentario: comentarioConUsuario,
        clasificacion: formData.clasificacion,
      });
  
      setFormErrors({}); // Limpiar errores
  
      // Enviar el testimonio con el comentario modificado
      const response = await fetch('http://localhost:8000/api/reseñas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          comentario: comentarioConUsuario, // Enviar el comentario con el usuario incluido
        }),
      });
  
      if (response.ok) {
        setFormData({ usuarioid: userid,comentario: '', clasificacion: 5 }); // Limpiar formulario
        fetchTestimonials(); // Recargar la lista de testimonios
      } else {
        // Verificar si el servidor responde con un error (como 400)
        const errorData = await response.json();
        console.error('Error al enviar el testimonio:', errorData);
      }
    } catch (error) {
      if (error.errors) {
        const errors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setFormErrors(errors);
      } else {
        console.error('Error inesperado:', error);
      }
    }
  };
  
  
  

  return (
    <section id='testimonios' className='py-16 bg-jetBlack text-lightGray'>
      <div className='max-w-screen-xl mx-auto'>
        <h2 className='text-4xl md:text-5xl font-serif font-bold text-mustard mb-12 text-center animate-fade-in-up'>
          Reseña de Nuestros Clientes
        </h2>
        <div className='flex flex-col md:flex-row gap-8'>
          {/* Columna Izquierda: Slider de Testimonios */}
          <div className='md:w-1/2 relative my-auto'>
            {testimonials.length > 0 ? (
              <div className='overflow-hidden rounded-xl shadow-2xl bg-jetBlack p-8'>
                <div
                  className='flex transition-transform duration-500 ease-in-out'
                  style={{
                    transform: `translateX(-${currentTestimonial * 100}%)`,
                  }}
                >
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className='w-full flex-shrink-0 flex flex-col items-center text-center px-6'
                    >
                      
                      <p className='text-lg text-lightGray italic mb-4'>
                        {testimonial.comentario}
                      </p>
                      <div className='flex mb-4'>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-2xl ${
                              i < testimonial.clasificacion
                                ? 'text-mustard'
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className='text-lightGray'>Cargando Reseña...</p>
            )}
            {/* Botones de Navegación */}
            {testimonials.length > 0 && (
              <>
                <div className='absolute top-1/2 left-0 transform -translate-y-1/2 px-4'>
                  <button
                    onClick={prevTestimonial}
                    className='bg-mustard text-jetBlack p-3 rounded-full shadow-lg hover:bg-bronze transition-all duration-300'
                  >
                    <FaChevronLeft className='text-2xl' />
                  </button>
                </div>
                <div className='absolute top-1/2 right-0 transform -translate-y-1/2 px-4'>
                  <button
                    onClick={nextTestimonial}
                    className='bg-mustard text-jetBlack p-3 rounded-full shadow-lg hover:bg-bronze transition-all duration-300'
                  >
                    <FaChevronRight className='text-2xl' />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Columna Derecha: Formulario para Enviar Testimonios */}
          <div className='md:w-1/2 bg-jetBlack p-8 rounded-xl shadow-2xl'>
            <h3 className='text-2xl font-serif font-bold text-mustard mb-6 text-center'>
              Deja tu Reseña
            </h3>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div>
                <label htmlFor='comentario' className='block mb-2'>
                  Comentario:
                </label>
                <textarea
                  id='comentario'
                  name='comentario'
                  value={formData.comentario}
                  onChange={handleChange}
                  className='w-full p-2 rounded bg-gray-800 text-lightGray'
                  rows='4'
                  placeholder='Escribe tu testimonio...'
                />
                {formErrors.comentario && (
                  <p className='text-red-500 text-sm mt-1'>
                    {formErrors.comentario}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor='clasificacion' className='block mb-2'>
                  Clasificación:
                </label>
                <select
                  id='clasificacion'
                  name='clasificacion'
                  value={formData.clasificacion}
                  onChange={handleChange}
                  className='w-full p-2 rounded bg-gray-800 text-lightGray'
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                {formErrors.clasificacion && (
                  <p className='text-red-500 text-sm mt-1'>
                    {formErrors.clasificacion}
                  </p>
                )}
              </div>
              <button
                type='submit'
                className='bg-mustard text-jetBlack p-3 rounded shadow-lg hover:bg-bronze transition-all duration-300'
                onClick={handleSubmit}
              >
                Enviar Reseña
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
