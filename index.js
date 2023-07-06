// Importo paquetes, dependencias y modulos
import express from 'express'
import dotenv from 'dotenv'
import router from './routes/index.js'
import expressEjsLayouts from 'express-ejs-layouts'
import db from './config/db.js'
import bodyParser from 'body-parser'
import flash from 'connect-flash'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from './config/passport.js'
// Conectar a la base de datos
db.sync().then(() => {
  console.log('Se conecto correctamente a la DB')
}).catch(error => {
  console.log(error)
})
// Configuro las variables de entorno
dotenv.config({ path: '.env' })
// Inicio el app
const app = express()
// Habilitar BodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Habilitar Express layout
app.use(expressEjsLayouts)
// Habilitar cookieParser
app.use(cookieParser())
// Habilitar express session
app.use(session({
  secret: process.env.SECRETO,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false
}))
// Habilitar passport
app.use(passport.initialize())
app.use(passport.session())
// Habilitar flash messages
app.use(flash())
// Habilitar EJS como template engine
app.set('view engine', 'ejs')
// Declaro la ubicacion de las vistas
app.set('views', './views')
// Archivos estaticos
app.use(express.static('public'))
// Middleware (session, flash messages, fecha actual, etc...)
app.use((req, res, next) => {
  res.locals.mensajes = req.flash()
  const fecha = new Date()
  res.locals.year = fecha.getFullYear()
  next()
})
// Routing
app.use('/', router)
// Ejecutar el servidor
app.listen(process.env.PORT, () => {
  console.log(`El servidor se esta ejecutando en: (http://localhost:${process.env.PORT})`)
})
