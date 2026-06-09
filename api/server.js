const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db'); // Importamos la conexión
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Ruta de test de DB
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: "Base de datos conectada correctamente", time: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const multer = require('multer');
const XLSX = require('xlsx');
const upload = multer({ dest: 'uploads/' }); // Carpeta temporal para el archivo

app.post('/upload-excel', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No se subió archivo" });

        // 1. Leer el Excel
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // 2. Insertar en BD (Usamos un bucle para recorrer el Excel)
       for (let row of data) {
    const { dni, nombre, empresa, vencimiento_sctr, direccion, nota } = row;
    
    // Convertimos la fecha si viene como número
    let fechaGuardar = vencimiento_sctr;
    if (typeof fechaGuardar === 'number') {
        const utc_days = Math.floor(fechaGuardar - 25569);
        fechaGuardar = new Date((utc_days) * 86400 * 1000).toISOString().split('T')[0];
    }

    const query = `
    INSERT INTO empleados (dni, nombre, empresa, vencimiento_sctr, direccion, nota)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (dni) DO UPDATE 
    SET nombre = EXCLUDED.nombre, empresa = EXCLUDED.empresa, 
        vencimiento_sctr = EXCLUDED.vencimiento_sctr, nota = EXCLUDED.nota;
`;
    await pool.query(query, [dni, nombre, empresa, fechaGuardar, direccion, nota || 0]);
}

        res.json({ message: "Excel procesado exitosamente", count: data.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/empleado/:dni', async (req, res) => {
    const { dni } = req.params;
    try {
        const result = await pool.query('SELECT * FROM empleados WHERE dni = $1', [dni]);
        if (result.rows.length === 0) return res.status(404).json({ error: "No encontrado" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { dni, password } = req.body;
    
    // Consulta la base de datos
    const result = await pool.query(
        'SELECT * FROM usuarios WHERE dni = $1 AND password = $2', 
        [dni, password]
    );

    if (result.rows.length > 0) {
        const usuario = result.rows[0];
        // Retornamos el rol para que el frontend sepa qué vista mostrar
        res.json({ success: true, rol: usuario.rol, nombre: usuario.nombre });
    } else {
        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
});

// RUTA: Crear nuevo usuario (Solo el Admin debería poder llamar a esto)
app.post('/usuarios', async (req, res) => {
    const { dni, password, rol, nombre } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (dni, password, rol, nombre) VALUES ($1, $2, $3, $4) RETURNING *',
            [dni, password, rol, nombre]
        );
        res.json({ success: true, usuario: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al crear usuario' });
    }
});

// RUTA: Listar usuarios (para la tabla del Admin)
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT dni, nombre, rol FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
    }
});

app.delete('/usuarios/:dni', async (req, res) => {
    await pool.query('DELETE FROM usuarios WHERE dni = $1', [req.params.dni]);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
});