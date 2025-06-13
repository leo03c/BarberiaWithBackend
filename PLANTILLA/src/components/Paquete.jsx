import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Paquete = () => {
  const [paquetes, setpaquetes] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 3;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/paquetes/")
      .then((response) => response.json())
      .then((data) => setpaquetes(data))
      .catch((error) => console.error("Error al cargar paquetes:", error));
  }, []);

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - cardsPerPage < 0 ? Math.max(paquetes.length - cardsPerPage, 0) : prev - cardsPerPage
    );
  };

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + cardsPerPage >= paquetes.length ? 0 : prev + cardsPerPage
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="paquetes" className="py-16 bg-slate-100 text-lightGray">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-mustard mb-12 animate-fade-in-up">
          Nuestros Paquetes
        </h2>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 ">
            <AnimatePresence mode="wait">
              {paquetes
                .slice(startIndex, startIndex + cardsPerPage)
                .map((paquete) => (
                  <motion.div
                    key={paquete.id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={cardVariants}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    whileHover={{ scale: 1.03, y: -5 }}
                  >
                    <img
                      src={paquete.imag}
                      alt={paquete.nombre}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6 text-left">
                      <h3 className="text-2xl font-serif font-semibold text-mustard mb-2">
                        {paquete.nombre}
                      </h3>
                      <p className=" text-slate-700 text-sm mb-4">
                        {paquete.descripcion}
                      </p>
                      <p className="text-xl font-serif font-bold text-mustard">
                        {paquete.precio}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* Botones de navegación */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4 z-10">
            <button
              onClick={prevSlide}
              className="bg-mustard text-jetBlack p-2 rounded-full shadow-lg hover:bg-bronze transition-all duration-300"
            >
              <FaChevronLeft className="text-xl" />
            </button>
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4 z-10">
            <button
              onClick={nextSlide}
              className="bg-mustard text-jetBlack p-2 rounded-full shadow-lg hover:bg-bronze transition-all duration-300"
            >
              <FaChevronRight className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Paquete;

