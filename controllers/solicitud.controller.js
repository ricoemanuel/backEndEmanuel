const { pool } = require("../database/index.db");

const getSolicitudes = async (req, res) => {
    try {
        const user = req.headers.user.split(" ")[1];
        const userData = await pool.query("SELECT rol from empleados where id = $1", [user])
        if (userData.rows[0].rol === "Administrador") {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const offset = (page - 1) * pageSize;
            const query = 'SELECT * FROM solicitud ORDER BY id OFFSET $1 LIMIT $2';
            const values = [offset, pageSize];
            const response = await pool.query(query, values);
            res.status(200).json(response.rows);
        }else{
            res.status(500).json({ error: 'No tienes permitido ver esta información' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSolicitudById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await pool.query('SELECT * FROM solicitud WHERE id = $1', [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSolicitudesByUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const query = 'SELECT * FROM solicitud WHERE empleado_id = $1 ORDER BY id OFFSET $2 LIMIT $3';
        const values = [id, offset, pageSize];
        const response = await pool.query(query, values);
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createSolicitud = async (req, res) => {
    try {
        const { codigo, descripcion, resumen, salario, empleado_id } = req.body;
        const query = 'INSERT INTO solicitud (codigo, descripcion, resumen, salario, empleado_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [codigo, descripcion, resumen, salario, empleado_id];
        const response = await pool.query(query, values);
        res.status(201).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSolicitud = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { codigo, descripcion, resumen, salario, empleado_id } = req.body;
        const query = 'UPDATE solicitud SET codigo = $1, descripcion = $2, resumen = $3, salario = $4, empleado_id = $5 WHERE id = $6 RETURNING *';
        const values = [codigo, descripcion, resumen, salario, empleado_id, id];
        const response = await pool.query(query, values);
        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSolicitud = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const query = 'DELETE FROM solicitud WHERE id = $1 RETURNING *';
        const values = [id];
        const response = await pool.query(query, values);
        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }
        res.status(200).json({ message: 'Solicitud eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getSolicitudes, getSolicitudById, createSolicitud, updateSolicitud, deleteSolicitud, getSolicitudesByUser };
