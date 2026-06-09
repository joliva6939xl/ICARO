import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel({ onLogout }) {
    const [usuarios, setUsuarios] = useState([]);
    const [newUser, setNewUser] = useState({ user: '', pass: '', rol: '1' });
    
    // EL TRUCO: Un estado que actúa como "gatillo" para recargar la tabla
    const [refreshKey, setRefreshKey] = useState(0); 

    // El useEffect perfecto: Todo vive adentro y no molesta a ESLint
    useEffect(() => {
        let componenteMontado = true; // Evita fugas de memoria

        const obtenerUsuarios = async () => {
            try {
                const res = await axios.get('http://localhost:3000/usuarios');
                // Solo actualiza el estado si el componente sigue en pantalla
                if (componenteMontado) {
                    setUsuarios(res.data);
                }
            } catch (err) { 
                console.error("Error cargando usuarios", err); 
            }
        };

        obtenerUsuarios();

        // Función de limpieza
        return () => { componenteMontado = false; };
        
    }, [refreshKey]); // Cada vez que refreshKey cambie, este useEffect vuelve a ejecutarse

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/usuarios', {
                dni: newUser.user,
                password: newUser.pass,
                rol: parseInt(newUser.rol),
                nombre: 'Usuario Genérico'
            });
            setNewUser({ user: '', pass: '', rol: '1' });
            // Hacemos "click" en el gatillo para recargar la tabla
            setRefreshKey(oldKey => oldKey + 1); 
        } catch (err) { 
            console.error("Error al crear usuario", err); 
            alert("Error al crear usuario"); 
        }
    };

    const handleDelete = async (dni) => {
        if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
            try {
                await axios.delete(`http://localhost:3000/usuarios/${dni}`);
                // Hacemos "click" en el gatillo para recargar la tabla
                setRefreshKey(oldKey => oldKey + 1); 
            } catch (err) { 
                console.error("Error al borrar", err); 
                alert("Error al borrar"); 
            }
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* HEADER ACTUALIZADO CON EL BOTÓN DE CERRAR SESIÓN */}
            <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: '#0F172A' }}>Panel de Administración</h1>
                    <p style={{ color: '#64748b' }}>Gestión de accesos y carga de datos</p>
                </div>
                <button onClick={onLogout} className="btn-secondary">Cerrar Sesión</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {/* 1. SECCIÓN EXCEL */}
                <div className="card-icaro">
                    <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Carga de Exámenes (Excel)</h2>
                    <input type="file" accept=".xlsx, .xls" style={{ marginBottom: '15px', width: '100%' }} />
                    <button className="btn-primary" style={{ width: '100%' }}>SUBIR EXCEL</button>
                </div>

                {/* 2. SECCIÓN CREAR USUARIO */}
                <form onSubmit={handleCreateUser} className="card-icaro">
                    <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Crear Usuario</h2>
                    <input type="text" placeholder="Usuario" value={newUser.user} onChange={(e) => setNewUser({...newUser, user: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cbd5e1' }} />
                    <input type="password" placeholder="Contraseña" value={newUser.pass} onChange={(e) => setNewUser({...newUser, pass: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #cbd5e1' }} />
                    <select value={newUser.rol} onChange={(e) => setNewUser({...newUser, rol: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #cbd5e1' }}>
                        <option value="1">Portería (Usuario)</option>
                        <option value="2">Central (Admin)</option>
                    </select>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>CREAR USUARIO</button>
                </form>
            </div>

            {/* 3. TABLA DE USUARIOS */}
            <div className="card-icaro" style={{ marginTop: '20px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Usuarios Registrados</h2>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '10px' }}>Usuario</th>
                            <th style={{ padding: '10px' }}>Rol</th>
                            <th style={{ padding: '10px' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.dni} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '10px' }}>{u.dni}</td>
                                <td style={{ padding: '10px' }}>{u.rol === 2 ? 'Central' : 'Portería'}</td>
                                <td style={{ padding: '10px' }}>
                                    <button onClick={() => handleDelete(u.dni)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>Borrar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPanel;