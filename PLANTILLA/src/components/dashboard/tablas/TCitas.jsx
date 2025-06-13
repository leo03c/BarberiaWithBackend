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

    useEffect(() => {
        fetchCitas();
        fetchUsuarios();
        fetchServicios();
    }, []);

    const fetchCitas = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setCitas(data);
        } catch (error) {
            console.error("Error al obtener las citas:", error);
        }
    };

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(USERS_API_URL);
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    const fetchServicios = async () => {
        try {
            const response = await fetch(SERVICES_API_URL);
            const data = await response.json();
            setServicios(data);
        } catch (error) {
            console.error("Error al obtener los servicios:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const citaData = { ...formData };
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_URL}${editingId}/` : API_URL;

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(citaData)
            });

            setEditingId(null);
            setFormData({ usuarioid: "", servicioid: "", comentario: "", fecha: "" });
            fetchCitas();
        } catch (error) {
            console.error("Error al guardar la cita:", error);
        }
    };

    const handleEdit = (cita) => {
        setEditingId(cita.id);
        setFormData({ ...cita });
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}${id}/`, { method: "DELETE" });
            fetchCitas();
        } catch (error) {
            console.error("Error al eliminar cita:", error);
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

    return (
        <div className="bg-slate-700 text-lightGray p-6 rounded-lg shadow-lg mt-20">
            <h2 className="text-3xl font-serif font-bold text-mustard mb-6">Gestión de Citas</h2>

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
                        required 
                    />
                    <input 
                        type="datetime-local" 
                        name="fecha" 
                        placeholder="Fecha" 
                        value={formData.fecha} 
                        onChange={handleInputChange} 
                        className="p-2 bg-gray-700 text-lightGray rounded-md" 
                        required 
                    />
                </div>
                <button type="submit" className="mt-4 w-full bg-mustard text-jetBlack py-2 rounded-lg font-semibold">
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
                        {currentItems.map((cita) => {
                            const usuario = usuarios.find(u => u.id === cita.usuarioid);
                            const servicio = servicios.find(s => s.id === cita.servicioid);
                            return (
                                <tr key={cita.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                                    <td className="py-2 px-4">
                                        {usuario ? `${usuario.nombre} ${usuario.apellidos}` : cita.usuarioid}
                                    </td>
                                    <td className="py-2 px-4">
                                        {servicio ? servicio.nombre : cita.servicioid}
                                    </td>
                                    <td className="py-2 px-4">{cita.comentario}</td>
                                    <td className="py-2 px-4">{new Date(cita.fecha).toLocaleString()}</td>
                                    <td className="py-2 px-4 flex justify-center gap-3">
                                        <button onClick={() => handleEdit(cita)} className="text-mustard hover:text-yellow-500 transition">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(cita.id)} className="text-red-500 hover:text-red-400 transition">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Controles de Paginación */}
            <div className="flex justify-center items-center gap-4 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                        currentPage === 1
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-mustard text-jetBlack hover:bg-yellow-500"
                    }`}
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
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default TCitas;
