import multer from 'multer'
import { nanoid } from 'nanoid'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const configuracionMulter = {
  limits: {
    fileSize: 1000000
  },
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, path.join(__dirname, '..', 'public/uploads/grupos/'))
    },
    filename: (req, file, next) => {
      const extension = file.mimetype.split('/')[1]
      next(null, `${nanoid()}.${extension}`)
    }
  }),
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      cb(new Error(`Solo se admiten formatos png o jpg (Formato subido: "${file.mimetype}")`), false)
    }
  }
}

const upload = multer(configuracionMulter).single('imagen')

export default upload
