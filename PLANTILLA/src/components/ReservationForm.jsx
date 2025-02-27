import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function ReservationForm() {
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    message: "",
  });
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/servicios/")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/citas/")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ service: "", date: "", message: "" });
  };

  const handleSelectAppointment = (id) => {
    setSelectedAppointments((prev) =>
      prev.includes(id) ? prev.filter((apptId) => apptId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(appointments.map((appt) => appt.id));
    }
    setAllSelected(!allSelected);
  };

  const handleDeleteAppointments = () => {
    selectedAppointments.forEach((id) => {
      fetch(`http://127.0.0.1:8000/citas/${id}/`, {
        method: "DELETE",
      })
        .then(() => setAppointments((prev) => prev.filter((appt) => appt.id !== id)))
        .catch((err) => console.error("Error deleting appointment:", err));
    });
    setSelectedAppointments([]);
    setAllSelected(false);
  };

  return (
    <div className="min-h-screen bg-jetBlack py-16 px-6 flex items-start justify-center">
      <div className="max-w-6xl w-full flex gap-8">
        {/* FORMULARIO */}
        <motion.div
          className="w-1/2 bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl text-mustard font-serif font-bold text-center mb-6">
            Reserva tu Cita
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-transparent border border-bronze text-lightGray"
              required
            >
              <option value="">Selecciona un servicio</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.nombre} - ${service.precio}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-transparent border border-bronze text-lightGray"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Comentarios Adicionales"
              className="w-full p-3 rounded-lg bg-transparent border border-bronze text-lightGray"
              rows="2"
            ></textarea>
            <button type="submit" className="bg-mustard text-black font-bold py-3 rounded-lg shadow-md">
              Reservar Cita
            </button>
          </form>
        </motion.div>

        {/* LISTA DE CITAS */}
        <div className="w-1/2 bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl p-8">
          <h3 className="text-3xl text-mustard font-serif font-bold mb-4">Tus Citas</h3>
          {appointments.length === 0 ? (
            <p className="text-lightGray">No hay citas reservadas.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {appointments.map((appt) => {
                  const service = services.find((s) => s.id === appt.servicioid);
                  return (
                    <li
                      key={appt.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                        selectedAppointments.includes(appt.id)
                          ? "border-mustard bg-mustard text-jetBlack"
                          : "border-bronze bg-jetBlack text-lightGray"
                      }`}
                      onClick={() => handleSelectAppointment(appt.id)}
                    >
                      <strong>{service ? service.nombre : "Servicio desconocido"}</strong> - {new Date(appt.fecha).toLocaleString()}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex gap-4">
                <button onClick={toggleSelectAll} className="bg-mustard text-black font-bold py-3 px-4 rounded-lg shadow-md">
                  {allSelected ? "Deseleccionar Todas" : "Seleccionar Todas"}
                </button>
                <button onClick={handleDeleteAppointments} className="border border-mustard bg-white bg-opacity-10 text-lightGray font-bold py-3 px-4 rounded-lg shadow-md" disabled={selectedAppointments.length === 0}>
                  Eliminar Seleccionadas
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservationForm;
