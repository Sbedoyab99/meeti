import passport from 'passport'

const autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorios'
})

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/iniciar-sesion')
}

export {
  autenticarUsuario,
  isAuth
}
