import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

const API_URL = "http://localhost:8000/api/promociones/";

const TPromociones = () => {
    const [promociones, setPromociones] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        servicio: "",
        porcientoDesc: ""
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchPromociones();
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const promocionData = { ...formData };
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_URL}${editingId}/` : API_URL;

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(promocionData)
            });

            setEditingId(null);
            setFormData({ nombre: "", descripcion: "", servicio: "", porcientoDesc: "" });
            fetchPromociones();
        } catch (error) {
            console.error("Error al guardar la promoción:", error);
        }
    };

    const handleEdit = (promocion) => {
        setEditingId(promocion.id);
        setFormData({ ...promocion });
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}${id}/`, { method: "DELETE" });
            fetchPromociones();
        } catch (error) {
            console.error("Error al eliminar promoción:", error);
        }
    };

    return (
        <div className="bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20">
            <h2 className="text-3xl font-serif font-bold text-mustard mb-6">Gestión de Promociones</h2>

            {/* Formulario de promoción */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="nombre" placeholder="Nombre de la promoción" value={formData.nombre} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <input type="text" name="servicio" placeholder="ID Servicio" value={formData.servicio} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <input type="number" name="porcientoDesc" placeholder="Porcentaje de descuento" value={formData.porcientoDesc} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                </div>
                <button type="submit" className="mt-4 w-full bg-mustard text-jetBlack py-2 rounded-lg font-semibold">
                    {editingId ? "Actualizar Promoción" : "Agregar Promoción"}
                </button>
            </form>

            {/* Tabla de promociones */}
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full bg-gray-800 rounded-lg">
                    <thead>
                        <tr className="text-mustard">
                            <th className="py-2 px-4 text-left">Nombre</th>
                            <th className="py-2 px-4 text-left">Servicio</th>
                            <th className="py-2 px-4 text-left">Descripción</th>
                            <th className="py-2 px-4 text-left">Descuento (%)</th>
                            <th className="py-2 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promociones.map((promocion) => (
                            <tr key={promocion.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                                <td className="py-2 px-4">{promocion.nombre}</td>
                                <td className="py-2 px-4">{promocion.servicio}</td>
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TPromociones;
