import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/rese%C3%B1as/"); // Reemplaza con la URL real de tu API
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

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

  return (
    <section id="testimonios" className="py-16 bg-jetBlack text-lightGray">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-mustard mb-12 animate-fade-in-up">
          Testimonios de Nuestros Clientes
        </h2>
        <div className="relative">
          {testimonials.length > 0 ? (
            <div className="overflow-hidden rounded-xl shadow-2xl bg-jetBlack p-8">
              <div className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 flex flex-col items-center text-center px-6">

                    {/* aqui cuendo entre el formulario hay q guardar la cita con el usuario q la creo */}
                    
                    <p className="text-lg text-lightGray italic mb-4">
                      {testimonial.comentario}
                    </p>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-2xl ${i < testimonial.clasificacion ? 'text-mustard' : 'text-gray-400'}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-lightGray">Cargando testimonios...</p>
          )}

          {/* Botones de Navegación */}
          {testimonials.length > 0 && (
            <>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4">
                <button
                  onClick={prevTestimonial}
                  className="bg-mustard text-jetBlack p-3 rounded-full shadow-lg hover:bg-bronze transition-all duration-300"
                >
                  <FaChevronLeft className="text-2xl" />
                </button>
              </div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4">
                <button
                  onClick={nextTestimonial}
                  className="bg-mustard text-jetBlack p-3 rounded-full shadow-lg hover:bg-bronze transition-all duration-300"
                >
                  <FaChevronRight className="text-2xl" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
