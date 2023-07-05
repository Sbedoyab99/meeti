import express from 'express'
import { home } from '../controllers/HomeController.js'
import { formCrearCuenta, crearCuenta, formIniciarSesion } from '../controllers/UsuariosController.js'
// Creo el router
const router = express.Router()
// Home
router.get('/', home)
// Crear Cuenta
router.get('/crear-cuenta', formCrearCuenta)
router.post('/crear-cuenta', crearCuenta)
// Iniciar Sesion
router.get('/iniciar-sesion', formIniciarSesion)

export default router
