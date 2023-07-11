import { Sequelize } from 'sequelize'
import db from '../config/db.js'
import { v4 as uuidv4 } from 'uuid'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'

const Grupo = db.define('grupos', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: uuidv4()
  },
  nombre: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El grupo debe tener un nombre'
      }
    }
  },
  descripcion: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Coloca una descripcion'
      }
    }
  },
  url: Sequelize.TEXT,
  imagen: Sequelize.TEXT
})

Grupo.belongsTo(Categoria)
Grupo.belongsTo(Usuario)

export default Grupo
