import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [iduser, setIduser] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      // Realizar fetch para obtener los detalles del usuario desde la API
      fetch(`http://127.0.0.1:8000/clientes/?usuario=${username}`) 
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            setUser(data[0].usuario); 
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  const login = (username) => {
    localStorage.setItem('username', username);
    // Realizar fetch para obtener los detalles del usuario
    fetch(`http://127.0.0.1:8000/clientes/?usuario=${username}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setUser(data[0].usuario); 
          setIduser(data[0].id); 
          localStorage.setItem('id', data[0].id);
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, iduser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
