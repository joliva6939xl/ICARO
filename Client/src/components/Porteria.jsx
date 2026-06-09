import { useState } from 'react';
import axios from 'axios';
import './Porteria.css'; // Asegúrate de actualizar este archivo también

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
                console.error("Error ICARO:", err);
                alert("DNI no registrado.");
            }
        }
    };

    return (
        <div className="icaro-module">
            <header className="icaro-header">
                <div>
                    <h1>ICARO</h1>
                    <p>Módulo de Portería - Central de Monitoreo</p>
                </div>
                <button onClick={onLogout} className="btn-secondary">Cerrar Módulo</button>
            </header>

            <div className="layout-grid">
                {/* 1. FOTO - ESPACIO RESERVADO */}
                <div className="card-icaro photo-box">
                    <span>FOTO PERFIL</span>
                </div>

                {/* 2. CAJA BUSQUEDA Y EMPRESA */}
                <div className="card-icaro info-box">
                    <input 
                        autoFocus 
                        className="icaro-input-main"
                        placeholder="Escanear DNI..." 
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        onKeyDown={handleScan}
                    />
                    {empleado && (
                        <div className="empleado-detail">
                            <h3>{empleado.nombre}</h3>
                            <p className="empresa-tag">{empleado.empresa}</p>
                        </div>
                    )}
                </div>

                {/* 3. PANEL INFERIOR (SCTR, NOTAS, COMENTARIOS) */}
                <div className="card-icaro bottom-panel-icaro">
                    {/* Sección SCTR y Notas */}
                    <div className="results-icaro">
                        {empleado ? (
                            <>
                                <p className={empleado.nota >= 14 ? 'status-ok' : 'status-bad'}>
                                    {empleado.nota >= 14 ? `✅ Nota: ${empleado.nota} (APROBADO)` : `❌ Nota: ${empleado.nota} (PENDIENTE)`}
                                </p>
                                <p className="status-ok"> ✅ SCTR: Vigente </p>
                            </>
                        ) : (
                            <p style={{color: '#94a3b8', fontStyle: 'italic'}}>Esperando escaneo...</p>
                        )}
                    </div>
                    
                    {/* Sección Comentarios */}
                    <div className="comments-icaro">
                        <textarea 
                            placeholder="Añadir comentario de seguridad (Ej. Falta EPP, autorizado por...)"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            style={{ width: '100%', height: '80px', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                        />
                        <button className="btn-primary" style={{marginTop: '10px'}}>Guardar Log</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Porteria;