const { pool } = require("../database/index.db")
const bcrypt = require('bcrypt');


const getEmpleados = async (req, res) => {
  try {
    const user = req.headers.user.split(" ")[1];
    const userData = await pool.query("SELECT rol from empleados where id = $1", [user])
    if (userData.rows[0].rol === "Administrador") {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 20;
      const offset = (page - 1) * pageSize;
      const query = 'SELECT * FROM empleados ORDER BY id OFFSET $1 LIMIT $2';
      const values = [offset, pageSize];
      const response = await pool.query(query, values);
      res.status(200).json(response.rows)
    } else {
      res.status(403).json({ error: 'No tienes permitido ver esta información' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getEmpleadoById = async (req, res) => {
  const user = req.headers.user.split(" ")[1];
  const userData = await pool.query("SELECT id, rol from empleados where id = $1", [user]);
  if (userData.rows.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  const userRole = userData.rows[0].rol;
  const userId = userData.rows[0].id;
  const id = parseInt(req.params.id);
  if (userRole === "Administrador" || userId === id) {
    
    const response = await pool.query("SELECT * FROM empleados WHERE id = $1", [id]);
    res.json(response.rows);
  } else {
    res.status(500).json({ error: 'No tienes permitido ver esta información' });
  }

};

const createEmpleado = async (req, res) => {
  try {
    const { fecha_ingreso, nombre, salario, correo, contrasena } = req.body;

    const existingUserQuery = 'SELECT * FROM login WHERE correo = $1';
    const existingUserValues = [correo];
    const existingUserResult = await pool.query(existingUserQuery, existingUserValues);

    if (existingUserResult.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
    }
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const empleadosQuery = 'INSERT INTO empleados (fecha_ingreso, nombre, salario, rol) VALUES ($1, $2, $3,$4) RETURNING *';
    const empleadosValues = [fecha_ingreso, nombre, salario, 'empleado'];
    const empleadosResponse = await pool.query(empleadosQuery, empleadosValues);

    const loginQuery = 'INSERT INTO login (correo, contrasena, empleado_id) VALUES ($1, $2, $3) RETURNING *';
    const loginValues = [correo, hashedPassword, empleadosResponse.rows[0].id];
    await pool.query(loginQuery, loginValues);

    res.status(201).json(empleadosResponse.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_ingreso, nombre, salario } = req.body;

    // Verificar si el usuario es administrador
    const user = req.headers.user.split(" ")[1];
    const userData = await pool.query("SELECT id, rol from empleados where id = $1", [user]);
    if (userData.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const userRole = userData.rows[0].rol;
    const userId = userData.rows[0].id;

    if (userRole === "Administrador" || userId === parseInt(id)) {

      const query = 'UPDATE empleados SET fecha_ingreso = $1, nombre = $2, salario = $3 WHERE id = $4 RETURNING *';
      const values = [fecha_ingreso, nombre, salario, id];
      const response = await pool.query(query, values);

      if (response.rows.length === 0) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      res.status(200).json(response.rows[0]);
    } else {
      res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteEmpleado = async (req, res) => {
  try {
    const user = req.headers.user.split(" ")[1];
    const userData = await pool.query("SELECT rol from empleados where id = $1", [user])
    if (userData.rows[0].rol === "Administrador") {
      const { id } = req.params;
      const query = 'DELETE FROM empleados WHERE id = $1 RETURNING *';
      const values = [id];
      const response = await pool.query(query, values);
      if (response.rows.length === 0) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      res.status(200).json({ message: 'Empleado eliminado correctamente' });
    } else {
      res.status(500).json({ error: 'No tienes permitido ver esta información' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado, getEmpleadoById }