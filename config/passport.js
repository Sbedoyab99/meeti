import passport from 'passport'
import LocalStrategy from 'passport-local'
import Usuario from '../models/Usuario.js'

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
async (email, password, done) => {
  const usuario = await Usuario.findOne({ where: { email } })
  if (!usuario) {
    return done(null, false, {
      message: 'El usuario no existe'
    })
  }
  const verificarPass = usuario.validarPassword(password)
  if (!verificarPass) {
    return done(null, false, {
      message: 'La contraseña no es correcta'
    })
  }
  if (usuario.activo === 0) {
    return done(null, false, {
      message: 'El usuario no ha sido confirmado.'
    })
  }
  return done(null, usuario)
}
))

passport.serializeUser(function (usuario, cb) {
  cb(null, usuario)
})
passport.deserializeUser(function (usuario, cb) {
  cb(null, usuario)
})

export default passport
