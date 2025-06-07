import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PromotionsBar = () => {
    const [promotions, setPromotions] = useState([]);
    const [services, setServices] = useState([]);

    // Obtener promociones
    useEffect(() => {
        fetch("http://localhost:8000/api/promociones/")
            .then((response) => response.json())
            .then((data) => setPromotions(data))
            .catch((error) => console.error("Error fetching promotions:", error));
    }, []);

    // Obtener los servicios correspondientes
    useEffect(() => {
        if (promotions.length === 0) return;

        const fetchServices = async () => {
            try {
                const servicePromises = promotions.map((promotion) =>
                    fetch(`http://localhost:8000/api/servicios/${promotion.servicio}`)
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

    if (promotions.length === 0 || services.length === 0) return null;

    return (
        <div className="w-full px-8 py-6 bg-slate-800">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-mustard mb-12 animate-fade-in-up text-center">Promociones destacadas</h2>
            <div className="flex overflow-x-auto space-x-6 scrollbar-thin scrollbar-thumb-mustard scrollbar-track-gray-700">
                {promotions.map((promotion, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="min-w-[300px] bg-white rounded-2xl shadow-lg p-4 flex-shrink-0 hover:scale-105 transition-transform duration-300 ease-in-out"
                    >
                        {promotion.imag && (
                            <img
                                src={promotion.imag}
                                alt={promotion.nombre}
                                className="w-full h-40 object-cover rounded-xl mb-3"
                            />
                        )}
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{promotion.nombre}</h3>
                        <p className="text-gray-600 text-sm mb-2">{promotion.descripcion}</p>
                        <p className="text-mustard font-semibold text-lg mb-1">
                            {promotion.porcientoDesc}% OFF
                        </p>
                        <p className="text-gray-700 text-sm">
                            <span className="font-bold">Paquete:</span> {services[index]?.nombre || "Cargando..."}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PromotionsBar;
