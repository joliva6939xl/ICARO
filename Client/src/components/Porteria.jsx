import { useState } from 'react';
import axios from 'axios';
import './Porteria.css'; // Crearemos este archivo para el estilo

function Porteria({ onLogout }) {
    const [dni, setDni] = useState('');
    const [empleado, setEmpleado] = useState(null);
    const [comentario, setComentario] = useState('');

    const handleScan = async (e) => {
        if (e.key === 'Enter') {
            try {
                const res = await axios.get(`http://localhost:3000/empleado/${dni}`);
                setEmpleado(res.data);
            } catch (err) {
                console.error("Error al buscar empleado:", err);
                alert("Empleado no encontrado");
            }
        }
    };

    return (
        <div className="icaro-container">
            <header className="header">
                <h1>ICARO - Módulo de Portería</h1>
                <button onClick={onLogout} className="btn-logout">Cerrar Sesión</button>
            </header>

            <div className="main-layout">
                {/* 1. FOTO */}
                <div className="foto-box">
                    <div className="foto-placeholder">FOTO</div>
                </div>

                {/* 2. CAJA DE BUSQUEDA Y EMPRESA */}
                <div className="info-box">
                    <input 
                        autoFocus 
                        className="search-input"
                        placeholder="Escanea el DNI aquí..." 
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        onKeyDown={handleScan}
                    />
                    {empleado && (
                        <div className="empresa-data">
                            <h3>{empleado.nombre}</h3>
                            <p><strong>Empresa:</strong> {empleado.empresa}</p>
                        </div>
                    )}
                </div>

                {/* 3. NOTAS, SCTR Y COMENTARIOS */}
                <div className="bottom-panel">
                    <div className="status-box">
                        {empleado && (
                            <>
                                <p className={empleado.nota >= 14 ? 'ok' : 'error'}>
                                    {empleado.nota >= 14 ? `✅ Nota: ${empleado.nota} (Aprobado)` : `❌ Nota: ${empleado.nota} (Consultar encargado)`}
                                </p>
                                <p className={empleado.vencimiento_sctr ? 'ok' : 'error'}>
                                    {/* Aquí asumiríamos lógica de fecha */}
                                    ✅ SCTR: Vigente
                                </p>
                            </>
                        )}
                    </div>
                    
                    <div className="comentarios-box">
                        <textarea 
                            placeholder="Agregar comentarios de seguridad..."
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        />
                        <button className="btn-save">Guardar Comentario</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Porteria;