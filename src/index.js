const express = require('express');
const app = express();
const cors = require('cors'); 
// Puerto predeterminado
const DEFAULT_PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// Routes
app.use(require('../routes/index'));

// Función para iniciar el servidor
const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

// Manejo de errores si el puerto predeterminado no está disponible
process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${DEFAULT_PORT} is already in use, trying another port...`);
    const newPort = DEFAULT_PORT + 1;
    startServer(newPort);
  } else {
    console.error(err);
  }
});

// Iniciar el servidor
startServer(DEFAULT_PORT);
