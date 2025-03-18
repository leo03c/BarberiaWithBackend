import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PromotionsBar = () => {
    const [promotions, setPromotions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [services, setServices] = useState([]);

    // Obtener promociones
    useEffect(() => {
        fetch("http://localhost:8000/api/promociones/")
            .then((response) => response.json())
            .then((data) => setPromotions(data))
            .catch((error) => console.error("Error fetching promotions:", error));
    }, []);

    // Obtener los detalles de los servicios de las promociones
    useEffect(() => {
        if (promotions.length === 0) return;

        const fetchServices = async () => {
            try {
                const servicePromises = promotions.map((promotions) =>
                    fetch(`http://localhost:8000/api/servicios/${promotions.servicio}`)
                        .then((response) => response.json())
                );
                const servicesData = await Promise.all(servicePromises);
                setServices(servicesData);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, [promotions]);

    // Actualizar la promoción cada 7 segundos
    useEffect(() => {
        if (promotions.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % promotions.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [promotions.length]);

    if (promotions.length === 0 || services.length === 0) return null;

    return (
        <div className="w-full px-8 py-4 bg-jetBlack shadow-md ">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="flex items-center justify-between space-x-8"
                >
                    {/* Contenedor de la Promoción */}
                    <div className="flex flex-col space-y-2">
                        <span className="text-lg md:text-2xl font-semibold text-mustard uppercase tracking-wide">
                            {promotions[currentIndex].nombre}
                        </span>
                        <span className="text-sm md:text-base text-lightGray">
                            {promotions[currentIndex].descripcion}
                        </span>
                    </div>

                    {/* Información del Servicio y Descuento */}
                    <div className="flex flex-col items-end space-y-2">
                        <span className="block text-2xl font-bold text-mustard">
                            {promotions[currentIndex].porcientoDesc}% OFF
                        </span>
                        <span className="text-sm md:text-base text-lightGray">
                            <span className="font-semibold text-white">Servicio:</span> {services[currentIndex]?.nombre || 'Cargando...'}
                        </span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PromotionsBar;
