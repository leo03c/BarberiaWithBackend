import { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:8000/api/trabajadores/";
const ITEMS_PER_PAGE = 5;

const TTrabajadores = () => {
    const [trabajadores, setTrabajadores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        ci: "",
        nombre: "",
        apellidos: "",
        salario: "",
        puesto: ""
    });
    const [editingCi, setEditingCi] = useState(null);

    useEffect(() => {
        fetchTrabajadores();
    }, []);

    const fetchTrabajadores = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setTrabajadores(data);
        } catch (error) {
            console.error("Error al obtener los trabajadores:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const method = editingCi ? "PUT" : "POST";
            const url = editingCi ? `${API_URL}${editingCi}/` : API_URL;

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            setEditingCi(null);
            setFormData({ ci: "", nombre: "", apellidos: "", salario: "", puesto: "" });
            fetchTrabajadores(); // Refrescar la lista
        } catch (error) {
            console.error("Error al guardar el trabajador:", error);
        }
    };

    const handleEdit = (trabajador) => {
        setEditingCi(trabajador.ci);
        setFormData(trabajador);
    };

    const handleDelete = async (ci) => {
        try {
            await fetch(`${API_URL}${ci}/`, { method: "DELETE" });
            fetchTrabajadores(); // Actualizar lista
        } catch (error) {
            console.error("Error al eliminar trabajador:", error);
        }
    };

    // Calcular trabajadores para la página actual
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = trabajadores.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(trabajadores.length / ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bg-slate-700 text-lightGray p-6 rounded-lg shadow-lg mt-20">
            <h2 className="text-3xl font-serif font-bold text-mustard mb-6">Gestión de Trabajadores</h2>

            {/* Formulario de Trabajador */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" name="ci" placeholder="Cédula de Identidad" value={formData.ci} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <input type="text" name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <input type="number" name="salario" placeholder="Salario" value={formData.salario} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                    <input type="text" name="puesto" placeholder="Puesto" value={formData.puesto} onChange={handleInputChange} className="p-2 bg-gray-700 text-lightGray rounded-md" required />
                </div>
                <button type="submit" className="mt-4 w-full bg-mustard text-jetBlack py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                    <PlusCircle size={18} />
                    {editingCi ? "Actualizar Trabajador" : "Agregar Trabajador"}
                </button>
            </form>

            {/* Tabla de Trabajadores */}
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-lg">
                    <thead>
                        <tr className="text-mustard">
                            <th className="py-2 px-4 text-left">C.I.</th>
                            <th className="py-2 px-4 text-left">Nombre</th>
                            <th className="py-2 px-4 text-left">Apellidos</th>
                            <th className="py-2 px-4 text-left">Salario</th>
                            <th className="py-2 px-4 text-left">Puesto</th>
                            <th className="py-2 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(trabajador => (
                            <tr key={trabajador.ci} className="border-t border-gray-700 hover:bg-gray-700 transition">
                                <td className="py-2 px-4">{trabajador.ci}</td>
                                <td className="py-2 px-4">{trabajador.nombre}</td>
                                <td className="py-2 px-4">{trabajador.apellidos}</td>
                                <td className="py-2 px-4">${trabajador.salario}</td>
                                <td className="py-2 px-4">{trabajador.puesto}</td>
                                <td className="py-2 px-4 flex justify-center gap-3">
                                    <button onClick={() => handleEdit(trabajador)} className="text-mustard hover:text-yellow-500 transition">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(trabajador.ci)} className="text-red-500 hover:text-red-400 transition">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
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

export default TTrabajadores;
