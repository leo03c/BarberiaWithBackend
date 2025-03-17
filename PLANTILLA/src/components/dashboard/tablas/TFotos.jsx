import { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

const API_URL = "http://localhost:8000/api/fotos/";

const TFotos = () => {
    const [fotos, setFotos] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        imag: null
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchFotos();
    }, []);

    const fetchFotos = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setFotos(data);
        } catch (error) {
            console.error("Error al obtener las fotos:", error);
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
        if (formData.imag) formDataObj.append("imag", formData.imag);

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_URL}${editingId}/` : API_URL;

            await fetch(url, {
                method,
                body: formDataObj,
            });

            setEditingId(null);
            setFormData({ nombre: "", imag: null });
            fetchFotos();
        } catch (error) {
            console.error("Error al guardar la foto:", error);
        }
    };

    const handleEdit = (foto) => {
        setEditingId(foto.id);
        setFormData({ nombre: foto.nombre, imag: null });
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}${id}/`, { method: "DELETE" });
            fetchFotos();
        } catch (error) {
            console.error("Error al eliminar foto:", error);
        }
    };

    return (
        <div className="bg-jetBlack text-lightGray p-6 rounded-lg shadow-lg mt-20">
            <h2 className="text-3xl font-serif font-bold text-mustard mb-6">Gestión de Fotos</h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="text" 
                        name="nombre" 
                        placeholder="Nombre de la foto" 
                        value={formData.nombre} 
                        onChange={handleInputChange} 
                        className="p-2 bg-gray-700 text-lightGray rounded-md" 
                        required 
                    />
                    <input 
                        type="file" 
                        name="imag" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="p-2 bg-gray-700 text-lightGray rounded-md" 
                    />
                </div>
                <button type="submit" className="mt-4 w-full bg-mustard text-jetBlack py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                    <PlusCircle size={18} />
                    {editingId ? "Actualizar Foto" : "Agregar Foto"}
                </button>
            </form>

            {/* Tabla de Fotos */}
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-lg">
                    <thead>
                        <tr className="text-mustard">
                            <th className="py-2 px-4 text-left">Imagen</th>
                            <th className="py-2 px-4 text-left">Nombre</th>
                            <th className="py-2 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fotos.map((foto) => (
                            <tr key={foto.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                                <td className="py-2 px-4">
                                    {foto.imag && <img src={foto.imag} alt={foto.nombre} className="h-12 w-12 object-cover rounded-md" />}
                                </td>
                                <td className="py-2 px-4">{foto.nombre}</td>
                                <td className="py-2 px-4 flex justify-center gap-3">
                                    <button onClick={() => handleEdit(foto)} className="text-mustard hover:text-yellow-500 transition">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(foto.id)} className="text-red-500 hover:text-red-400 transition">
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

export default TFotos;
