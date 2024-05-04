const {Router}=require('express')
const {getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado,getEmpleadoById}=require('../controllers/empelado.controller.js')
const { authenticateJWT, loginUser } = require('../controllers/auth.controller.js');
const { getSolicitudes, getSolicitudById,getSolicitudesByUser, createSolicitud, updateSolicitud, deleteSolicitud } = require('../controllers/solicitud.controller.js');

const router=Router();
//empleados
router.get('/empleados',authenticateJWT,getEmpleados)
router.get('/empleados/:id',authenticateJWT,getEmpleadoById)
router.post('/empleados',createEmpleado)
router.put('/empleados/:id',authenticateJWT,updateEmpleado)
router.delete('/empleados/:id',authenticateJWT,deleteEmpleado)
//login
router.post('/login',loginUser)
//solicitudes
router.get('/solicitudes', authenticateJWT, getSolicitudes);
router.get('/solicitudes/:id', authenticateJWT, getSolicitudById);
router.get('/solicitudesByUser/:id', authenticateJWT, getSolicitudesByUser);
router.post('/solicitudes', authenticateJWT, createSolicitud);
router.put('/solicitudes/:id', authenticateJWT, updateSolicitud);
router.delete('/solicitudes/:id', authenticateJWT, deleteSolicitud);

module.exports=router