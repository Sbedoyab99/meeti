import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { emailRegistro, emailRecuperar } from '../handlers/email.js'

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
    const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`
    await emailRegistro({
      usuario,
      url,
      subject: 'Confirma tu cuenta en Meeti',
      archivo: 'confirmar-cuenta'
    })
    req.flash('exito', 'Se ha enviado un email a tu correo con las instrucciones para verificar tu cuenta')
    return res.redirect('/iniciar-sesion')
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const errorSequelize = 'Ya hay un usuario registrado con ese correo, intentalo de nuevo.'
      req.flash('error', errorSequelize)
      return res.redirect('crear-cuenta')
    }
  }
}

const confirmarCuenta = async (req, res, next) => {
  const usuario = await Usuario.findOne({ where: { email: req.params.email } })
  if (!usuario) {
    req.flash('error', 'No se ha encontrado esa cuenta')
    res.redirect('/crear-cuenta')
    return next()
  }
  if (usuario.activo === 1) {
    req.flash('error', 'Esta cuenta ya ha sido confirmada.')
    res.redirect('/iniciar-sesion')
    return next()
  }
  usuario.activo = 1
  await usuario.save()
  req.flash('exito', 'Tu cuenta se ha confirmado. Ya puedes iniciar sesión.')
  return res.redirect('/iniciar-sesion')
}

const formIniciarSesion = (req, res) => {
  res.render('iniciar-sesion', {
    nombrePagina: 'Inicia Sesión en Meeti'
  })
}

export {
  formCrearCuenta,
  crearCuenta,
  formIniciarSesion,
  confirmarCuenta
}
