import { useState } from 'react';
import Porteria from './components/Porteria';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel'; // IMPORTAMOS EL NUEVO PANEL
import './App.css';

function App() {
    // Leemos tanto el estado de autenticación como el rol al iniciar
    const [authState, setAuthState] = useState(() => {
        return {
            isAuthenticated: localStorage.getItem('icaro_auth') === 'true',
            rol: localStorage.getItem('icaro_rol') || null
        };
    });

    const handleLogout = () => {
        localStorage.removeItem('icaro_auth');
        localStorage.removeItem('icaro_rol');
        setAuthState({ isAuthenticated: false, rol: null });
    };

    // Si no está autenticado, mostramos el Login
    if (!authState.isAuthenticated) {
        return <Login onLogin={() => {
            // Cuando el Login es exitoso, leemos el rol que acaba de guardar y actualizamos
            const nuevoRol = localStorage.getItem('icaro_rol');
            setAuthState({ isAuthenticated: true, rol: nuevoRol });
        }} />;
    }

    // Si el rol es '2' (Central de Monitoreo / Admin), mostramos el Panel de Admin
    if (authState.rol === '2') {
        return <AdminPanel onLogout={handleLogout} />;
    }

    // Por defecto (rol '1'), mostramos Portería
    return <Porteria onLogout={handleLogout} />;
}

export default App;