/* eslint-disable no-prototype-builtins */
import Categoria from '../models/Categoria.js'
import Grupo from '../models/Grupo.js'
import { v4 as uuidv4 } from 'uuid'
import upload from '../config/multer.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { unlink } from 'fs'

const subirImagen = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          req.flash('error', 'La imagen es muy pesada')
        }
      } else if (error.hasOwnProperty('message')) {
        req.flash('error', error.message)
      }
      return res.redirect('back')
    } else {
      next()
    }
  })
}

const formNuevoGrupo = async (req, res) => {
  const categorias = await Categoria.findAll()
  res.render('nuevo-grupo', {
    nombrePagina: 'Crea un nuevo grupo',
    categorias
  })
}

const nuevoGrupo = async (req, res) => {
  const grupo = req.body
  grupo.id = uuidv4()
  grupo.usuarioId = req.user.id
  grupo.categoriaId = grupo.categoria
  if (req.file) {
    grupo.imagen = req.file.filename
  }
  try {
    await Grupo.create(grupo)
    req.flash('exito', `Se ha creado el Grupo: ${grupo.nombre}`)
    res.redirect('/admin')
  } catch (error) {
    const errores = error.errors.map(err => err.message)
    req.flash('error', errores)
    res.redirect('/nuevo-grupo')
  }
}


const formEditarGrupo = async (req, res) => {
  const consultas = []
  consultas.push(Grupo.findByPk(req.params.grupoId))
  consultas.push(Categoria.findAll())
  const [grupo, categorias] = await Promise.all(consultas)
  res.render('editar-grupo', {
    nombrePagina: `Editar Grupo: ${grupo.nombre}`,
    grupo,
    categorias
  })
}

const editarGrupo = async (req, res) => {
  const grupo = await Grupo.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } })
  if (!grupo) {
    req.flash('error', 'Operacion no Valida')
    return res.redirect('/administracion')
  }
  const { nombre, descripcion, categoriaId, url } = req.body
  grupo.nombre = nombre
  grupo.descripcion = descripcion
  grupo.categoriaId = categoriaId
  grupo.url = url

  await grupo.save()
  req.flash('exito', 'Cambios almaenados correctamente')
  res.redirect('/admin')
}

const formEditarImagen = async (req, res) => {
  const grupo = await Grupo.findByPk(req.params.grupoId)
  res.render('imagen-grupo', {
    nombrePagina: `Editar Imagen Grupo: ${grupo.nombre}`,
    grupo
  })
}

const editarImagen = async (req, res, next) => {
  const grupo = await Grupo.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } })
  if (!grupo) {
    req.flash('error', 'Operacion no Valida')
    return res.redirect('/administracion')
  }
  if (grupo.imagen && req.file) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const imagenAnteriorPath = path.join(__dirname, '..', `public/uploads/grupos/${grupo.imagen}`)
    unlink(imagenAnteriorPath, (error) => {
      if (error) {
        return console.log(error)
      }
    })
  }
  if (req.file) {
    grupo.imagen = req.file.filename
  }
  await grupo.save()
  req.flash('exito', 'Cambios almacenados correctamente')
  res.redirect('/admin')
}


const formEliminarGrupo = async (req, res) => {
  const grupo = await Grupo.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } })
  if (!grupo) {
    req.flash('error', 'Operacion no Valida')
    return res.redirect('/admin')
  }
  res.render('eliminar-grupo', {
    nombrePagina: `Eliminar Grupo: ${grupo.nombre}`
  })
}

const eliminarGrupo = async (req, res, next) => {
  const grupo = await Grupo.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } })
  if (!grupo) {
    req.flash('error', 'Operacion no Valida')
    return res.redirect('/administracion')
  }
  if (grupo.imagen) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const imagenPath = path.join(__dirname, '..', `public/uploads/grupos/${grupo.imagen}`)
    unlink(imagenPath, (error) => {
      if (error) {
        return console.log(error)
      }
    })
  }
  await grupo.destroy()
  req.flash('exito', 'Grupo Eliminado.')
  res.redirect('/admin')
}

export {
  formNuevoGrupo,
  nuevoGrupo,
  subirImagen,
  formEditarGrupo,
  editarGrupo,
  formEditarImagen,
  editarImagen,
  formEliminarGrupo,
  eliminarGrupo
}
