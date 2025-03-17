import { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

const API_URL = "http://localhost:8000/api/servicios/";

const TServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        precio: "",
        descripcion: "",
        imag: null
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchServicios();
    }, []);

    const fetchServicios = async () => {
        try {
            const response = await fetch(API_URL);
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

    const handleFileChange = (e) => {
        setFormData({ ...formData, imag: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        formDataObj.append("nombre", formData.nombre);
        formDataObj.append("precio", formData.precio);
        formDataObj.append("descripcion", formData.descripcion);
        if (formData.imag) formDataObj.append("imag", formData.imag);

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_URL}${editingId}/` : API_URL;

            await fetch(url, {
                method,
                body: formDataObj,
            });

            setEditingId(null);
            setFormData({ nombre: "", precio: "", descripcion: "", imag: null });
            fetchServicios();
        } catch (error) {
            console.error("Error al guardar el servicio:", error);
        }
    };

    const handleEdit = (servicio) => {
        setEditingId(servicio.id);
        setFormData({ ...servicio, imag: null });
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}${id}/`, { method: "DELETE" });
            fetchServicios();
        } catch (error) {
            console.error("Error al eliminar servicio:", error);
        }
    };

    
    return (
        <div className="bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20">
            <h2 className="text-3xl font-serif font-bold text-mustard mb-6">Gestión de Servicios</h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="nombre" placeholder="Nombre del servicio" value={formData.nombre} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <input type="number" step="0.01" name="precio" placeholder="Precio" value={formData.precio} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md col-span-2" required />
                    <input type="file" name="imag" accept="image/*" onChange={handleFileChange} className="p-2 bg-gray-700 text-lightGray rounded-md" />
                </div>
                <button type="submit" className="mt-4 w-full bg-mustard text-jetBlack py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                    <PlusCircle size={18} />
                    {editingId ? "Actualizar Servicio" : "Agregar Servicio"}
                </button>
            </form>

            {/* Tabla de Servicios */}
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-lg">
                    <thead>
                        <tr className="text-mustard">
                            <th className="py-2 px-4 text-left">Imagen</th>
                            <th className="py-2 px-4 text-left">Servicio</th>
                            <th className="py-2 px-4 text-left">Precio</th>
                            <th className="py-2 px-4 text-left">Descripción</th>
                            <th className="py-2 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicios.map((servicio) => (
                            <tr key={servicio.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                                <td className="py-2 px-4">
                                    {servicio.imag && <img src={servicio.imag} alt={servicio.nombre} className="h-12 w-12 object-cover rounded-md" />}
                                </td>
                                <td className="py-2 px-4">{servicio.nombre}</td>
                                <td className="py-2 px-4">${servicio.precio}</td>
                                <td className="py-2 px-4">{servicio.descripcion}</td>
                                <td className="py-2 px-4 flex justify-center gap-3">
                                    <button onClick={() => handleEdit(servicio)} className="text-mustard hover:text-yellow-500 transition">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(servicio.id)} className="text-red-500 hover:text-red-400 transition">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TServicios;
