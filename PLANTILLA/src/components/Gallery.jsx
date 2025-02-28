import { useEffect, useState } from 'react';

const Gallery = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const url = 'http://127.0.0.1:8000/fotos/';

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch(url);
      const jsonData = await response.json();

      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }

      setData(jsonData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div>Cargando...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className='bg-jetBlack text-lightGray min-h-screen py-12 pt-24'>
      <div className='max-w-7xl mx-auto px-6'>
        <h1 className='text-5xl font-bold text-center text-mustard mb-12 font-serif'>
          Galeria
        </h1>

        {/* Lista de Productos en Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {data.map((data) => (
            <div
              key={data.id}
              className='bg-lightGray rounded-lg shadow-lg hover:shadow-xl transition-all'
            >
              <img
                src={data.imag}
                alt={data.name}
                className='w-full h-52 object-cover'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
