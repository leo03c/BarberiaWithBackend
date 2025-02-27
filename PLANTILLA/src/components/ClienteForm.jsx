import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Para redirigir

function ClienteForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    usuario: "",
    correo: "",
    telefono: "",
    password: "",
  });

  const [mensaje, setMensaje] = useState(""); // Estado para mostrar mensaje en pantalla
  const navigate = useNavigate(); // Hook para redirigir

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generarEnlace = (usuario) => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < 7; i++) {
      randomString += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return usuario + randomString;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const enlaceGenerado = generarEnlace(formData.usuario);

      const dataToSend = {
        ...formData,
        telefono: formData.telefono.trim() === "" ? null : parseInt(formData.telefono, 10),
        enlace: enlaceGenerado,
      };

      const response = await fetch("http://127.0.0.1:8000/clientes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al registrar cliente: ${errorData.message || "Detalles no disponibles"}`);
      }

      setMensaje("Registro exitoso. Redirigiendo..."); // Mostrar mensaje

      setTimeout(() => {
        navigate("/"); // Redirigir después de 3 segundos
      }, 3000);

      setFormData({
        nombre: "",
        apellidos: "",
        usuario: "",
        correo: "",
        telefono: "",
        password: "",
      });
    } catch (error) {
      setMensaje(`Hubo un problema: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-jetBlack py-16 px-6 flex items-center justify-center">
      <motion.div
        className="max-w-4xl w-full bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl text-mustard font-serif font-bold text-center mb-10">
          Registro de Cliente
        </h2>

        {mensaje && (
          <p className="text-center text-green-400 font-semibold mb-4">{mensaje}</p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-lightGray font-medium mb-2" htmlFor="nombre">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mustard transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-lightGray font-medium mb-2" htmlFor="apellidos">
              Apellidos
            </label>
            <input
              type="text"
              name="apellidos"
              id="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray focus:outline-none focus:ring-2 focus:ring-mustard transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-lightGray font-medium mb-2" htmlFor="usuario">
              Usuario
            </label>
            <input
              type="text"
              name="usuario"
              id="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray focus:outline-none focus:ring-2 focus:ring-mustard transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-lightGray font-medium mb-2" htmlFor="correo">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              id="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray focus:outline-none focus:ring-2 focus:ring-mustard transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-lightGray font-medium mb-2" htmlFor="telefono">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              id="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray focus:outline-none focus:ring-2 focus:ring-mustard transition-all"
            />
          </div>

          <div>
            <label className="block text-lightGray font-medium mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-transparent border border-bronze text-lightGray focus:outline-none focus:ring-2 focus:ring-mustard transition-all"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-mustard text-jetBlack font-bold py-4 px-8 rounded-lg shadow-md hover:bg-bronze hover:text-lightGray transition-all duration-300"
            >
              Registrarse
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default ClienteForm;
