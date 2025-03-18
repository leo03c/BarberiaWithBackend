// ReservationForm.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
// Importamos el custom hook useFetch para obtener datos
import { useFetch } from '../hook/useFetch';

function ReservationForm() {
  const { iduser } = useAuth();

  // Estado para el formulario de reserva
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    message: '',
  });

  // Usamos useFetch para obtener la lista de servicios
  const { data: servicesData } = useFetch('http://127.0.0.1:8000/servicios/');
  const [services, setServices] = useState([]);

  // Usamos useFetch para obtener las citas (appointments) del cliente,
  const { data: appointmentsData } = useFetch(
    iduser ? `http://127.0.0.1:8000/citas/?clienteid=${iduser}` : ''
  );
  const [appointments, setAppointments] = useState([]);

  // Estado para manejar la selección de citas
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  // Sincroniza la lista de servicios con los datos obtenidos
  useEffect(() => {
    if (servicesData) {
      setServices(Array.isArray(servicesData) ? servicesData : []);
    }
  }, [servicesData]);

  // Sincroniza la lista de citas con los datos obtenidos
  useEffect(() => {
    if (appointmentsData) {
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    }
  }, [appointmentsData]);

  // Maneja los cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envía la nueva cita al backend
  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica que iduser esté definido
    if (!iduser) {
      console.error('iduser es undefined. No se puede crear la cita.');
      return;
    }

    const newAppointment = {
      clienteid: iduser,
      servicioid: formData.service,
      fecha: formData.date,
      comentario: formData.message || '',
    };

    fetch('http://127.0.0.1:8000/citas/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAppointment),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al crear la cita');
        }
        return res.json();
      })
      .then((data) => {
        // Agrega la nueva cita al estado
        setAppointments((prev) => [...prev, data]);
        // Reinicia el formulario
        setFormData({ service: '', date: '', message: '' });
      })
      .catch((err) => console.error('Error creating appointment:', err));
  };

  // Alterna la selección de una cita individual
  const handleSelectAppointment = (id) => {
    setSelectedAppointments((prev) =>
      prev.includes(id) ? prev.filter((apptId) => apptId !== id) : [...prev, id]
    );
  };

  // Alterna la selección de todas las citas
  const toggleSelectAll = () => {
    setAllSelected(!allSelected);
    setSelectedAppointments(
      allSelected ? [] : appointments.map((appt) => appt.id)
    );
  };

  // Elimina las citas seleccionadas del backend y actualiza el estado
  const handleDeleteAppointments = () => {
    selectedAppointments.forEach((id) => {
      fetch(`http://127.0.0.1:8000/citas/${id}/`, { method: 'DELETE' })
        .then(() =>
          setAppointments((prev) => prev.filter((appt) => appt.id !== id))
        )
        .catch((err) => console.error('Error deleting appointment:', err));
    });
    setSelectedAppointments([]);
    setAllSelected(false);
  };

  // Al montar el componente, se asegura de que la página se posicione al inicio
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='min-h-screen bg-jetBlack py-16 px-6 flex justify-center'>
      <div className='max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* FORMULARIO DE RESERVA */}
        <motion.div
          className='bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className='text-3xl sm:text-4xl text-mustard font-serif font-bold text-center mb-6'>
            Reserva tu Cita
          </h2>
          <form onSubmit={handleSubmit} className='grid gap-4'>
            <select
              name='service'
              value={formData.service}
              onChange={handleChange}
              className='w-full p-3 rounded-lg bg-transparent border border-bronze text-lightGray'
              required
            >
              <option value=''>Selecciona un servicio</option>
              {services.map((service) => (
                <option
                  key={service.id}
                  value={service.id}
                  className='text-black'
                >
                  {service.nombre} - ${service.precio}
                </option>
              ))}
            </select>
            <input
              type='datetime-local'
              name='date'
              value={formData.date}
              onChange={handleChange}
              className='w-full p-3 rounded-lg bg-transparent border border-bronze text-lightGray'
              required
            />
            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              placeholder='Comentarios Adicionales'
              className='w-full p-3 rounded-lg bg-transparent border border-bronze text-lightGray'
              rows='2'
            >  </textarea>
            <button
              type='submit'
              className='bg-mustard text-black font-bold py-3 rounded-lg shadow-md'
              disabled={!iduser}
            >
              {iduser ? 'Reservar Cita' : 'Cargando Cliente...'}
            </button>
          </form>
        </motion.div>

        {/* LISTA DE CITAS */}
        <div className='bg-white bg-opacity-10 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8'>
          <h3 className='text-2xl sm:text-3xl text-mustard font-serif font-bold mb-4'>
            Tus Citas
          </h3>
          {appointments.length === 0 ? (
            <p className='text-lightGray'>No hay citas reservadas.</p>
          ) : (
            <>
              <ul className='space-y-4 max-h-80 overflow-y-auto'>
                {appointments.map((appt, index) => {
                  // Buscamos el servicio correspondiente a la cita
                  const service = services.find(
                    (s) => s.id === appt.servicioid
                  );
                  return (
                    <li
                      key={appt.id || index}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                        selectedAppointments.includes(appt.id)
                          ? 'border-mustard bg-mustard text-jetBlack'
                          : 'border-bronze bg-jetBlack text-lightGray'
                      }`}
                      onClick={() => handleSelectAppointment(appt.id)}
                    >
                      <strong>
                        {service ? service.nombre : 'Servicio desconocido'}
                      </strong>{' '}
                      - {new Date(appt.fecha).toLocaleString()}
                    </li>
                  );
                })}
              </ul>
              <div className='mt-4 flex flex-col sm:flex-row gap-4'>
                <button
                  onClick={toggleSelectAll}
                  className='bg-mustard text-black font-bold py-3 px-4 rounded-lg shadow-md'
                >
                  {allSelected ? 'Deseleccionar Todas' : 'Seleccionar Todas'}
                </button>
                <button
                  onClick={handleDeleteAppointments}
                  className='border border-mustard bg-white bg-opacity-10 text-lightGray font-bold py-3 px-4 rounded-lg shadow-md'
                  disabled={selectedAppointments.length === 0}
                >
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
