import express from 'express'
import { home } from '../controllers/HomeController.js'
import { formCrearCuenta, crearCuenta, confirmarCuenta, formIniciarSesion } from '../controllers/UsuariosController.js'
import { autenticarUsuario, isAuth } from '../controllers/AuthController.js'
import { admin } from '../controllers/AdminController.js'
import { formNuevoGrupo, nuevoGrupo, subirImagen, formEditarGrupo, editarGrupo, formEditarImagen, editarImagen, formEliminarGrupo, eliminarGrupo } from '../controllers/GruposController.js'
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
// Editar imagen grupo
router.get('/imagen-grupo/:grupoId', isAuth, formEditarImagen)
router.post('/imagen-grupo/:grupoId', isAuth, subirImagen, editarImagen)
// Eliminar Grupos
router.get('/eliminar-grupo/:grupoId', isAuth, formEliminarGrupo)
router.post('/eliminar-grupo/:grupoId', isAuth, eliminarGrupo)
// Crear Meeti
router.get('/nuevo-meeti', isAuth)

export default router
