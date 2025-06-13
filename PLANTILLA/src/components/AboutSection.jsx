import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-100 text-lightGray">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-serif font-bold text-mustard mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Vive la Luna de Miel de tus Sueños
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          En <span className="text-mustard font-semibold">Paraíso</span>, diseñamos experiencias únicas y románticas 
          para que cada pareja celebre el inicio de su historia de amor en los destinos más encantadores del mundo.
          Nos encargamos de cada detalle para que tú solo te preocupes por disfrutar.
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-left">
            <h3 className="text-2xl font-serif font-semibold text-mustard mb-2">
              Asesoría Personalizada
            </h3>
            <p className="text-slate-700 text-sm">
              Nuestros expertos en viajes te guiarán para elegir el destino perfecto y crear un itinerario a tu medida.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-left">
            <h3 className="text-2xl font-serif font-semibold text-mustard mb-2">
              Destinos Exóticos
            </h3>
            <p className="text-slate-700 text-sm">
              Desde playas paradisíacas hasta ciudades románticas en Europa, seleccionamos solo lo mejor para ti.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-left">
            <h3 className="text-2xl font-serif font-semibold text-mustard mb-2">
              Todo Incluido
            </h3>
            <p className="text-slate-700 text-sm">
              Paquetes completos que incluyen vuelos, hospedaje, experiencias exclusivas y sorpresas para los enamorados.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
