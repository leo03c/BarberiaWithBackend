import { useState, useEffect } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:8000/api/promociones/";
const SERVICES_API_URL = "http://localhost:8000/api/servicios/";
const ITEMS_PER_PAGE = 5;

const TPromociones = () => {
    const [promociones, setPromociones] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        servicio: "",
        porcientoDesc: "",
        imag: null
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchPromociones();
        fetchServicios();
    }, []);

    const fetchPromociones = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setPromociones(data);
        } catch (error) {
            console.error("Error al obtener las promociones:", error);
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
        const { name, value, files } = e.target;
        if (name === "imag") {
            setFormData({ ...formData, imag: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formToSend = new FormData();
        formToSend.append("nombre", formData.nombre);
        formToSend.append("descripcion", formData.descripcion);
        formToSend.append("servicio", formData.servicio);
        formToSend.append("porcientoDesc", formData.porcientoDesc);
        if (formData.imag) {
            formToSend.append("imag", formData.imag);
        }

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_URL}${editingId}/` : API_URL;

            const response = await fetch(url, {
                method,
                body: formToSend
            });

            if (!response.ok) throw new Error("Error al guardar la promoción");

            setEditingId(null);
            setFormData({
                nombre: "",
                descripcion: "",
                servicio: "",
                porcientoDesc: "",
                imag: null
            });
            fetchPromociones();
        } catch (error) {
            console.error("Error al guardar la promoción:", error);
        }
    };

    const handleEdit = (promocion) => {
        setEditingId(promocion.id);
        setFormData({
            nombre: promocion.nombre,
            descripcion: promocion.descripcion,
            servicio: promocion.servicio,
            porcientoDesc: promocion.porcientoDesc,
            imag: null // No se puede prellenar imágenes en input file
        });
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}${id}/`, { method: "DELETE" });
            fetchPromociones();
        } catch (error) {
            console.error("Error al eliminar promoción:", error);
        }
    };

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = promociones.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(promociones.length / ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20">
            <h2 className="text-3xl font-serif font-bold text-mustard mb-6">Gestión de Promociones</h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow mb-6" encType="multipart/form-data">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="nombre" placeholder="Nombre de la promoción" value={formData.nombre} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    
                    <select 
                        name="servicio" 
                        value={formData.servicio} 
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

                    <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    
                    <input type="number" name="porcientoDesc" placeholder="Porcentaje de descuento" value={formData.porcientoDesc} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    
                    <input type="file" name="imag" onChange={handleInputChange} className="col-span-2 p-2 bg-gray-700 text-lightGray rounded-md" accept="image/*" />
                </div>

                <button type="submit" className="mt-4 w-full bg-mustard text-jetBlack py-2 rounded-lg font-semibold">
                    {editingId ? "Actualizar Promoción" : "Agregar Promoción"}
                </button>
            </form>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-lg">
                    <thead>
                        <tr className="text-mustard">
                            <th className="py-2 px-4 text-left">Imagen</th>
                            <th className="py-2 px-4 text-left">Nombre</th>
                            <th className="py-2 px-4 text-left">Servicio</th>
                            <th className="py-2 px-4 text-left">Descripción</th>
                            <th className="py-2 px-4 text-left">Descuento (%)</th>
                            <th className="py-2 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((promocion) => {
                            const servicio = servicios.find(s => s.id === promocion.servicio);
                            return (
                                <tr key={promocion.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                                    
                                    <td className="py-2 px-4">
                                    {promocion.imag && <img src={promocion.imag} alt={promocion.nombre} className="h-12 w-12 object-cover rounded-md" />}
                                </td>
                                    <td className="py-2 px-4">{promocion.nombre}</td>
                                    <td className="py-2 px-4">
                                        {servicio ? servicio.nombre : promocion.servicio}
                                    </td>
                                    <td className="py-2 px-4">{promocion.descripcion}</td>
                                    <td className="py-2 px-4">{promocion.porcientoDesc}%</td>
                                    <td className="py-2 px-4 flex justify-center gap-3">
                                        <button onClick={() => handleEdit(promocion)} className="text-mustard hover:text-yellow-500 transition">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(promocion.id)} className="text-red-500 hover:text-red-400 transition">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
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

export default TPromociones;
