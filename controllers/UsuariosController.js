import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'

const formCrearCuenta = (req, res) => {
  res.render('crear-cuenta', {
    nombrePagina: 'Crea tu Cuenta en Meeti'
  })
}

const crearCuenta = async (req, res) => {
  const usuario = req.body
  await check('nombre').notEmpty().withMessage('El Nombre es Obligatorio').run(req)
  await check('email').notEmpty().withMessage('El Correo es Obligatorio').isEmail().withMessage('No se reconoce el formato de correo.').run(req)
  await check('password').isLength({ min: 8 }).withMessage('La Contraseña debe contener al menos 8 caracteres').run(req)
  await check('confirmar').equals(req.body.password).withMessage('Las Contraseñas no coinciden. Intentalo de nuevo').run(req)
  const resultado = validationResult(req)
  if (resultado.array().length) {
    const mensajes = resultado.array().map(err => err.msg)
    req.flash('error', mensajes)
    return res.redirect('crear-cuenta')
  }
  try {
    await Usuario.create(usuario)
    req.flash('exito', 'Se ha enviado un email a tu correo con las instrucciones para verificar tu cuenta')
    res.redirect('/iniciar-sesion')
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const errorSequelize = 'Ya hay un usuario registrado con ese correo, intentalo de nuevo.'
      req.flash('error', errorSequelize)
      res.redirect('crear-cuenta')
    }
  }
}

const formIniciarSesion = (req, res) => {
  res.render('iniciar-sesion', {
    nombrePagina: 'Inicia Sesión en Meeti'
  })
}

export {
  formCrearCuenta,
  crearCuenta,
  formIniciarSesion
}
