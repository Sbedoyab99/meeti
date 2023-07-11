import Grupo from '../models/Grupo.js'


const admin = async (req, res) => {
  const grupos = await Grupo.findAll({ where: { usuarioId: req.user.id } })
  res.render('administracion', {
    nombrePagina: 'Administracion',
    grupos
  })
}

export {
  admin
}
