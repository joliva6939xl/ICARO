import { useState } from 'react';
import Porteria from './components/Porteria';
import Login from './components/Login';
import './App.css';

function App() {
    // Patrón de "Lazy Initializer": se lee de localStorage solo una vez al iniciar
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('icaro_auth') === 'true';
    });

    return (
        <div className="App">
            {isAuthenticated ? (
                // Pasamos la función setIsAuthenticated como prop para permitir el Logout
                <Porteria onLogout={() => {
                    localStorage.removeItem('icaro_auth');
                    setIsAuthenticated(false);
                }} />
            ) : (
                <Login onLogin={() => setIsAuthenticated(true)} />
            )}
        </div>
    );
}

export default App;