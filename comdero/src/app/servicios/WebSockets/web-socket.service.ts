import {Injectable, EventEmitter, Output} from '@angular/core';

/**
 * --------------------------------------
 * Importamos los paquetes necesarios "ngx-socket-io" tambien nuestro "environments" y por último
 * "ngx-cookie-service",
 * ----------------------------------------
 */
import {Socket} from 'ngx-socket-io';
import {GLOBAL} from "../global";
import {AgenteServicio} from "../agente.servicio";


@Injectable()
/**
 * Extendemos la clase "Socket" a nuestra clase
 */
export class WebSocketService extends Socket {

  /**
   * Declaramos un metodo de emitir el cual llamaremos "outEven"
   */
  @Output() outEven: EventEmitter<any> = new EventEmitter();

  /**
   * En nuestro constructor injectamos el "CookieService" para luego hacer uso de sus metodos.
   */

  public identidad = JSON.parse(localStorage.getItem('payload'));

  constructor(protected _agenteServicio: AgenteServicio) {



    super({
      url: 'https://www.comdero.com:5000',
     // url: 'http://192.168.0.102:5000',
      options: {
        query: {
          payload:localStorage.getItem('payload'),
        }
      }

    });

    this.ioSocket.on('connect', res => {
      this.ioSocket.emit('entrarChat', this.identidad, res => {
        console.log("--------------Usuario conectado");
      });
    });
    this.ioSocket.on('disconect', res => {
      console.log("Desconectado al servidor")
    })




  }

  /**
   * ---------------- EMITIR-------------------
   * Ahora solo nos falta poder emitir mensajes, para ello declaramos la funcion
   * "emitEvent" la cual va ser disparada por un "(click)" la cual emite un envento
   * con el nombre "default", y un payload de información el cual sera parseado
   * por nuestro backend.
   */


}
