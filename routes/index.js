import express from 'express'
import { home } from '../controllers/HomeController.js'
import { formCrearCuenta, crearCuenta, confirmarCuenta, formIniciarSesion } from '../controllers/UsuariosController.js'
import { autenticarUsuario, isAuth } from '../controllers/AuthController.js'
import { admin } from '../controllers/AdminController.js'
import { formNuevoGrupo, nuevoGrupo, subirImagen, formEditarGrupo, editarGrupo } from '../controllers/GruposController.js'
// Creo el router
const router = express.Router()
// Home
router.get('/', home)
// Crear Cuenta
router.get('/crear-cuenta', formCrearCuenta)
router.post('/crear-cuenta', crearCuenta)
// Verificar Cuenta
router.get('/confirmar-cuenta/:email', confirmarCuenta)
// Iniciar Sesion
router.get('/iniciar-sesion', formIniciarSesion)
router.post('/iniciar-sesion', autenticarUsuario)
// Panel de administracion
router.get('/admin', isAuth, admin)
// Crear Grupo
router.get('/nuevo-grupo', isAuth, formNuevoGrupo)
router.post('/nuevo-grupo', isAuth, subirImagen, nuevoGrupo)
// Editar Grupo
router.get('/editar-grupo/:grupoId', isAuth, formEditarGrupo)
router.post('/editar-grupo/:grupoId', isAuth, editarGrupo)

export default router
