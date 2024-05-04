require('dotenv').config();
const { pool } = require("../database/index.db")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

const loginUser = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const userQuery = 'SELECT * FROM login WHERE correo = $1';
    const userValues = [correo];
    const userResult = await pool.query(userQuery, userValues);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

    const userDataQuery = 'SELECT * FROM empleados WHERE id = $1';
    const userDataValues = [user.empleado_id];
    const userDataResult = await pool.query(userDataQuery, userDataValues);

    const dataUser=userDataResult.rows[0]
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: user.id, correo: user.correo }, process.env.JWT_SECRET, { expiresIn: '24h' });
    delete user.contrasena
    console.log(dataUser)
    res.json({ token: token, user: user, rol:dataUser.rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token)
  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        console.log(token)
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { loginUser, authenticateJWT };