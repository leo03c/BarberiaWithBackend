import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PromotionsBar = () => {
    const [promotions, setPromotions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch("http://localhost:8000/api/promociones/")
            .then((response) => response.json())
            .then((data) => setPromotions(data))
            .catch((error) => console.error("Error fetching promotions:", error));
    }, []);

    useEffect(() => {
        if (promotions.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % promotions.length);
        }, 7000); // Cambio más lento y elegante

        return () => clearInterval(interval);
    }, [promotions.length]);

    if (promotions.length === 0) return null;

    return (
        <div className="w-full px-8 py-4 bg-gradient-to-r from-[#1a1a1a] via-[#222222] to-[#1a1a1a] shadow-md">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="flex items-center justify-between text-lightGray"
                >
                    {/* Información de la Promoción */}
                    <div className="flex flex-col">
                        <span className="text-lg md:text-xl font-semibold text-mustard">
                            {promotions[currentIndex].nombre}
                        </span>
                        <span className="text-sm md:text-base">{promotions[currentIndex].descripcion}</span>
                    </div>

                    {/* Descuento y Producto */}
                    <div className="text-right">
                        <span className="block text-base md:text-lg font-semibold text-mustard">
                            {promotions[currentIndex].porcientoDesc}% OFF
                        </span>
                        <span className="text-sm md:text-base">
                            Producto: {promotions[currentIndex].producto}
                        </span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PromotionsBar;
