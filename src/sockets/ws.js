import Ws from '@adonisjs/websocket-client'
import { urlWs } from './../helpers/helpers'
const token = window.localStorage.getItem("token");

const ws = Ws(urlWs)
  .withJwtToken(token)
  .connect()

export default ws;