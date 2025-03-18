import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

const API_URL = "http://localhost:8000/api/citas/";

const TCitas = () => {
    const [citas, setCitas] = useState([]);
    const [formData, setFormData] = useState({
        usuarioid: "",
        servicioid: "",
        comentario: "",
        fecha: ""
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCitas();
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

    return (
        <div className="bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20">
            <h2 className="text-3xl font-serif font-bold text-mustard mb-6">Gestión de Citas</h2>

            {/* Formulario de cita */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="usuarioid" placeholder="ID Usuario" value={formData.usuarioid} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <input type="text" name="servicioid" placeholder="ID Servicio" value={formData.servicioid} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <input type="text" name="comentario" placeholder="Comentario" value={formData.comentario} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <input type="datetime-local" name="fecha" placeholder="Fecha" value={formData.fecha} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                </div>
                <button type="submit" className="mt-4 w-full bg-mustard text-jetBlack py-2 rounded-lg font-semibold">
                    {editingId ? "Actualizar Cita" : "Agregar Cita"}
                </button>
            </form>

            {/* Tabla de citas */}
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full bg-gray-800 rounded-lg">
                    <thead>
                        <tr className="text-mustard">
                            <th className="py-2 px-4 text-left">Usuario ID</th>
                            <th className="py-2 px-4 text-left">Servicio ID</th>
                            <th className="py-2 px-4 text-left">Comentario</th>
                            <th className="py-2 px-4 text-left">Fecha</th>
                            <th className="py-2 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citas.map((cita) => (
                            <tr key={cita.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                                <td className="py-2 px-4">{cita.usuarioid}</td>
                                <td className="py-2 px-4">{cita.servicioid}</td>
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TCitas;
