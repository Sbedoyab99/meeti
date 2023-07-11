import { Sequelize } from 'sequelize'
import db from '../config/db.js'

const Categoria = db.define('categorias', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: Sequelize.TEXT
})

export default Categoria
