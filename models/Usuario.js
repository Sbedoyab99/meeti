import { Sequelize } from 'sequelize'
import db from '../config/db.js'
import bcrypt from 'bcrypt'

const Usuario = db.define('usuarios', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: Sequelize.STRING(60),
  imagen: Sequelize.STRING(60),
  email: {
    type: Sequelize.STRING(30),
    allowNull: false,
    validate: {
      isEmail: { msg: 'No se reconoce el formato de correo.' }
    },
    unique: {
      args: true,
      message: 'Ya hay un usuario registrado con ese correo, intentalo de nuevo.'
    }
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false
  },
  activo: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  token: Sequelize.STRING,
  expiraToken: Sequelize.DATE
}, {
  hooks: {
    beforeCreate (usuario) {
      usuario.password = bcrypt.hashSync(usuario.password, 10)
    }
  }
})

Usuario.prototype.validarPassword = function (pasword) {
  return bcrypt.compareSync(pasword, this.password)
}

export default Usuario
