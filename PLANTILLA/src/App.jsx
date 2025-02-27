import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Main from './components/main';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import ReservationPage from './components/ReservationPage';
import ClienteForm from './components/ClienteForm';

function App() {
  const [user, setUser] = useState(null); // Estado para manejar el usuario autenticado

  return (
    <Router>
      <Header user={user} setUser={setUser} /> {/* Pasamos user y setUser */}
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/reserva' element={<ReservationPage />} />
        <Route
          path='/clienteform'
          element={<ClienteForm setUser={setUser} />}
        />
        <Route path='/galeria/' element={<Gallery />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
