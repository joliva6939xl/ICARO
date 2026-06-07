import { useState } from 'react';

function Login({ onLogin }) {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === '123456') {
            localStorage.setItem('icaro_auth', 'true');
            onLogin();
        } else {
            alert('Acceso Denegado. Credenciales incorrectas.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1a1a1a', color: '#fff' }}>
            <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: '40px', border: '1px solid #444', borderRadius: '10px' }}>
                <h1 style={{ color: '#00ff00', marginBottom: '20px' }}>ICARO v1.0</h1>
                <p>Sistema de Seguridad Centralizada</p>
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', fontSize: '18px', marginBottom: '20px', width: '100%', borderRadius: '5px' }}
                />
                <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#00ff00', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                    INGRESAR
                </button>
            </form>
        </div>
    );
}

export default Login;