import { useState, useEffect } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:8000/api/citas/";
const USERS_API_URL = "http://localhost:8000/api/usuarios/";
const SERVICES_API_URL = "http://localhost:8000/api/servicios/";
const ITEMS_PER_PAGE = 5;

const TCitas = () => {
    const [citas, setCitas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        usuarioid: "",
        servicioid: "",
        comentario: "",
        fecha: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                await fetchUsuarios();
                await fetchServicios();
                await fetchCitas();
            } catch (error) {
                console.error("Error loading data:", error);
                setError("Error al cargar los datos. Por favor, intente nuevamente.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const fetchCitas = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Error al obtener citas");
            const data = await response.json();
            setCitas(data);
        } catch (error) {
            console.error("Error al obtener las citas:", error);
            throw error;
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(USERS_API_URL);
            if (!response.ok) throw new Error("Error al obtener usuarios");
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            throw error;
        }
    };

    const fetchServicios = async () => {
        try {
            const response = await fetch(SERVICES_API_URL);
            if (!response.ok) throw new Error("Error al obtener servicios");
            const data = await response.json();
            setServicios(data);
        } catch (error) {
            console.error("Error al obtener los servicios:", error);
            throw error;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            
            // Validación de campos requeridos
            if (!formData.usuarioid || !formData.servicioid || !formData.fecha) {
                throw new Error("Todos los campos marcados como requeridos deben ser completados");
            }
    
            // Formatear los datos exactamente como los espera el backend
            const citaData = {
                usuario_id: Number(formData.usuarioid),
                servicio_id: Number(formData.servicioid),
                comentario: formData.comentario?.trim() || "",
                fecha: new Date(formData.fecha).toISOString() // Formato ISO
            };
    
            console.log("Datos a enviar:", citaData); // Para depuración
    
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_URL}${editingId}/` : API_URL;
    
            const response = await fetch(url, {
                method,
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(citaData)
            });
    
            const responseData = await response.json();
            
            if (!response.ok) {
                // Mostrar mensajes de error detallados del backend
                const errorDetails = responseData.detail || 
                                   JSON.stringify(responseData) ||
                                   "Error al guardar la cita";
                throw new Error(errorDetails);
            }
    
            // Resetear el formulario y recargar datos
            setEditingId(null);
            setFormData({ usuarioid: "", servicioid: "", comentario: "", fecha: "" });
            await fetchCitas();
            
        } catch (error) {
            console.error("Error al guardar la cita:", error);
            setError(error.message);
        }
    };
    

    const handleEdit = (cita) => {
        setEditingId(cita.id);
        setFormData({ 
            usuarioid: cita.usuarioid.id.toString(),
            servicioid: cita.servicioid.id.toString(),
            comentario: cita.comentario,
            fecha: cita.fecha.includes('T') ? cita.fecha.split('T')[0] + 'T' + cita.fecha.split('T')[1].slice(0,5) : cita.fecha
        });
    };

    const handleDelete = async (id) => {
        try {
            setError(null);
            const response = await fetch(`${API_URL}${id}/`, { 
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) throw new Error("Error al eliminar cita");
            await fetchCitas();
        } catch (error) {
            console.error("Error al eliminar cita:", error);
            setError("Error al eliminar la cita. Por favor, intente nuevamente.");
        }
    };

    // Calcular citas para la página actual
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = citas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(citas.length / ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-mustard text-xl">Cargando datos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20">
                <h2 className="text-3xl font-serif font-bold text-mustard mb-6">Gestión de Citas</h2>
                <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
                    {error}
                </div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-mustard text-jetBlack py-2 px-4 rounded-lg font-semibold"
                >
                    Recargar
                </button>
            </div>
        );
    }

    return (
        <div className="bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20">
            <h2 className="text-3xl font-serif font-bold text-mustard mb-6">Gestión de Citas</h2>

            {/* Mostrar mensaje de error del formulario */}
            {error && (
                <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Formulario de cita */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <select 
                        name="usuarioid" 
                        value={formData.usuarioid} 
                        onChange={handleInputChange} 
                        className="p-2 bg-gray-700 text-lightGray rounded-md" 
                        required
                    >
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map(usuario => (
                            <option key={usuario.id} value={usuario.id}>
                                {usuario.nombre} {usuario.apellidos} - {usuario.usuario}
                            </option>
                        ))}
                    </select>

                    <select 
                        name="servicioid" 
                        value={formData.servicioid} 
                        onChange={handleInputChange} 
                        className="p-2 bg-gray-700 text-lightGray rounded-md" 
                        required
                    >
                        <option value="">Seleccione un servicio</option>
                        {servicios.map(servicio => (
                            <option key={servicio.id} value={servicio.id}>
                                {servicio.nombre} - ${servicio.precio}
                            </option>
                        ))}
                    </select>

                    <input 
                        type="text" 
                        name="comentario" 
                        placeholder="Comentario" 
                        value={formData.comentario} 
                        onChange={handleInputChange} 
                        className="p-2 bg-gray-700 text-lightGray rounded-md" 
                    />
                    <input 
                        type="datetime-local" 
                        name="fecha" 
                        value={formData.fecha} 
                        onChange={handleInputChange} 
                        className="p-2 bg-gray-700 text-lightGray rounded-md" 
                        required 
                    />
                </div>
                <button type="submit" className="mt-4 w-full bg-mustard text-jetBlack py-2 rounded-lg font-semibold hover:bg-yellow-600 transition">
                    {editingId ? "Actualizar Cita" : "Agregar Cita"}
                </button>
            </form>

            {/* Tabla de citas */}
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-lg">
                    <thead>
                        <tr className="text-mustard">
                            <th className="py-2 px-4 text-left">Usuario</th>
                            <th className="py-2 px-4 text-left">Servicio</th>
                            <th className="py-2 px-4 text-left">Comentario</th>
                            <th className="py-2 px-4 text-left">Fecha</th>
                            <th className="py-2 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((cita) => (
                                <tr key={cita.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                                    <td className="py-2 px-4">
                                        {cita.usuarioid ? `${cita.usuarioid.nombre} ${cita.usuarioid.apellidos}` : 'Usuario no encontrado'}
                                    </td>
                                    <td className="py-2 px-4">
                                        {cita.servicioid ? cita.servicioid.nombre : 'Servicio no encontrado'}
                                    </td>
                                    <td className="py-2 px-4">{cita.comentario || '-'}</td>
                                    <td className="py-2 px-4">{new Date(cita.fecha).toLocaleString()}</td>
                                    <td className="py-2 px-4 flex justify-center gap-3">
                                        <button 
                                            onClick={() => handleEdit(cita)} 
                                            className="text-mustard hover:text-yellow-500 transition"
                                            aria-label="Editar"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(cita.id)} 
                                            className="text-red-500 hover:text-red-400 transition"
                                            aria-label="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 text-center">No hay citas registradas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Controles de Paginación */}
            {citas.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                            currentPage === 1
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-mustard text-jetBlack hover:bg-yellow-500"
                        }`}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    <span className="text-lightGray">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                            currentPage === totalPages
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-mustard text-jetBlack hover:bg-yellow-500"
                        }`}
                        aria-label="Página siguiente"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TCitas;