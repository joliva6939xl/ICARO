import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Petición al backend para validar usuario y contraseña
            const response = await axios.post('http://localhost:3000/login', { 
                dni, 
                password 
            });

            if (response.data.success) {
                // Guardamos estado y rol en el caché
                localStorage.setItem('icaro_auth', 'true');
                localStorage.setItem('icaro_rol', response.data.rol); // Rol 1 o 2
                onLogin();
            } else {
                alert('Acceso Denegado: ' + response.data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Error al conectar con el servidor. Verifica que el backend esté encendido.');
        }
    };

    return (
        <div style={{ 
            display: 'flex', minHeight: '100vh', justifyContent: 'center', 
            alignItems: 'center', position: 'relative', background: '#f8fafc' 
        }}>
            
            {/* Tarjeta de Login - Con Relieve Intenso */}
            <form onSubmit={handleSubmit} className="card-icaro" style={{ width: '320px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '28px', color: '#0F172A', marginBottom: '8px' }}>ICARO</h1>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Control de Acceso Centralizado</p>
                
                {/* Campo DNI */}
                <input 
                    type="text" 
                    placeholder="DNI / Usuario" 
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    style={{ 
                        width: '90%', padding: '16px', fontSize: '18px', marginBottom: '20px',
                        border: '1px solid #94a3b8', borderRadius: '4px', textAlign: 'center',
                        display: 'block', margin: '0 auto 20px auto'
                    }}
                />

                {/* Campo Contraseña */}
                <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ 
                        width: '90%', padding: '16px', fontSize: '18px', marginBottom: '25px',
                        border: '1px solid #94a3b8', borderRadius: '4px', textAlign: 'center',
                        display: 'block', margin: '0 auto 25px auto'
                    }}
                />

                <button type="submit" style={{ 
                    width: '100%', padding: '12px', background: '#0F172A', 
                    color: 'white', border: 'none', borderRadius: '4px', 
                    fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' 
                }}>
                    VALIDAR ACCESO
                </button>
            </form>

            {/* Créditos RSJ DIGITAL - Inferior Derecha */}
            <div style={{ 
                position: 'absolute', bottom: '20px', right: '20px', 
                fontSize: '12px', color: '#64748b', textAlign: 'right' 
            }}>
                <p><strong>CREADO POR RSJ DIGITAL</strong></p>
                <p>de Juan Oliva</p>
            </div>
        </div>
    );
}

export default Login;