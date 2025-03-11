import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { z } from 'zod';
import { motion } from 'framer-motion';

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
  const [formData, setFormData] = useState({
    usuarioid: userid,
    comentario: '',
    clasificacion: 5,
  });
  const [formErrors, setFormErrors] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  

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


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

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
      const safeUsername = username || 'Usuario';
      const comentarioConUsuario = `${safeUsername}: ${formData.comentario}`;

      testimonialSchema.parse({
        comentario: comentarioConUsuario,
        clasificacion: formData.clasificacion,
      });

      setFormErrors({});

      const response = await fetch('http://localhost:8000/api/reseñas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          comentario: comentarioConUsuario,
        }),
      });

      if (response.ok) {
        setFormData({ usuarioid: userid, comentario: '', clasificacion: 5 });
        fetchTestimonials();
      } else {
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
    <section id="testimonios" className="bg-jetBlack text-lightGray py-16 px-6 md:px-16">
      <div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-mustard mb-12 text-center animate-fade-in-up tracking-wide">
          Reseña de Nuestros Clientes
        </h2>
        <div className="flex flex-col lg:flex-row justify-center gap-12">
          <div className="w-full lg:w-1/2">
            {testimonials.length > 0 ? (
              <div className="overflow-hidden rounded-2xl shadow-xl bg-jetBlack p-8 transform transition-all ease-in-out duration-500 md:h-full flex items-center justify-center">
              <motion.div
                className="flex flex-col items-center text-center"
                key={testimonials[currentTestimonial].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1 }}
              >
                <p className="text-lg text-lightGray italic mb-6 leading-relaxed">
                  {testimonials[currentTestimonial].comentario}
                </p>
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-2xl ${
                        i < testimonials[currentTestimonial].clasificacion
                          ? 'text-mustard'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
            
            ) : (
              <p className="text-lightGray">Cargando Reseña...</p>
            )}
          </div>

          <div className="w-full lg:w-1/2 bg-jetBlack p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-serif font-bold text-mustard mb-6 text-center tracking-wide">
              Deja tu Reseña
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="comentario"
                  className="block mb-2 text-lg font-semibold text-lightGray"
                >
                  Comentario:
                </label>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  className="w-full p-4 rounded-lg bg-gray-800 text-lightGray placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mustard"
                  rows="5"
                  placeholder="Escribe tu testimonio..."
                />
                {formErrors.comentario && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.comentario}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="clasificacion"
                  className="block mb-2 text-lg font-semibold text-lightGray"
                >
                  Clasificación:
                </label>
                <select
                  id="clasificacion"
                  name="clasificacion"
                  value={formData.clasificacion}
                  onChange={handleChange}
                  className="w-full p-4 rounded-lg bg-gray-800 text-lightGray placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mustard"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                {formErrors.clasificacion && (
                  <p className="text-red-500 text-sm mt-2">{formErrors.clasificacion}</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-mustard text-jetBlack p-4 rounded-xl shadow-xl hover:bg-bronze transition-all duration-300 mt-6"
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
