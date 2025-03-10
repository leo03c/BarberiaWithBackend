import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReservationPage from './components/ReservationPage';
import ClienteForm from './components/ClienteForm';
import Gallery from './components/Gallery';
import LoginForm from './components/Login';
import Dashboard from './components/Dasboard'; // Componente del dashboard
import ProtectedRoute from './routes/Protecred';
import { Layout } from './Layout/MainLayout';
import Main from './components/main';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          {/* Página de inicio */}
          <Route index element={<Main />} />
          {/* Rutas hijas usando rutas relativas */}
          <Route path='reserva' element={<ReservationPage />} />
          <Route path='clienteform' element={<ClienteForm />} />
          <Route path='LoginForm' element={<LoginForm />} />
          <Route path='galeria' element={<Gallery />} />
          <Route
            path='dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
