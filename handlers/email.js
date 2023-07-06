import fs from 'fs'
import ejs from 'ejs'
import util from 'util'
import path from 'path'
import { fileURLToPath } from 'url'
import transport from '../config/email.js'

const emailRegistro = async (datos) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const { nombre, email } = datos.usuario
  const archivo = path.join(__dirname, '..', `views/emails/${datos.archivo}.ejs`)
  const archivoCompilado = ejs.compile(fs.readFileSync(archivo, 'utf8'))
  const html = archivoCompilado({ url: datos.url, nombre })
  const contenidoEmail = {
    from: 'Meeti <noreply@meeti.com>',
    to: email,
    subject: datos.subject,
    html
  }
  const enviarEmail = util.promisify(transport.sendMail, transport)
  return enviarEmail.call(transport, contenidoEmail)
}

const emailRecuperar = async (datos) => {
  const { nombre, email } = datos.usuario

  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Reestablece tu Contraseña en Bienes Raices',
    html: `
    <html>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&display=swap');
        h2 {
            font-size: 25px;
            font-weight: 500;
            line-height: 25px;
        }
    
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #ffffff;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
        }
    
        p {
            line-height: 18px;
        }
    
        a {
            position: relative;
            z-index: 0;
            display: inline-block;
            margin: 20px 0;
        }
    
        a button {
            padding: 0.7em 2em;
            font-size: 16px !important;
            font-weight: 500;
            background: #000000;
            color: #ffffff;
            border: none;
            text-transform: uppercase;
            cursor: pointer;
        }
        p span {
            font-size: 12px;
        }
        div p{
            border-bottom: 1px solid #000000;
            border-top: none;
            margin-top: 40px;
        }
        </style>
        <body>
            <h1>BienesRaices</h1>
            <h1>${nombre}</h1>
            <h2>Parece que has olvidado tu contraseña</h2>
            <p>Usa el siguiente boton para volver a disfrutar de todos los servicios de BienesRaices</p>
            <a href='${process.env.BACKEND_URL}${process.env.PORT ?? 3000}/auth/olvide-password/${token}'><button>Reestablecer Contraseña</button></a>
            <p>Si tú no realizaste esta solicitud, por favor ignora este correo electrónico.</p>
            <div><p></p></div>
            <p><span>Este correo electrónico fue enviado desde una dirección solamente de notificaciones que no puede aceptar correo electrónico entrante. Por favor no respondas a este mensaje.</span></p>
        </body>
    </html>
    `
  })
}

export {
  emailRegistro,
  emailRecuperar
}
