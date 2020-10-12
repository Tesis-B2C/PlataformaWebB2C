import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import {NotificacionesServicio} from "../../../servicios/notificaciones.servicio";
import {Router} from "@angular/router";
import {WebSocketService} from "../../../servicios/WebSockets/web-socket.service";

import {MenuGestionTiendasComponent} from "../menu-gestion-tiendas/menu-gestion-tiendas.component";

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  public identidadTienda;

  constructor(public menu: MenuGestionTiendasComponent, public  _socketServicio: WebSocketService, public router: Router, public _tiendaServicio: TiendaServicio, public _notificacionesServicio: NotificacionesServicio) {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
  }

  ngOnInit() {
    this.getMisNotificacionesTienda();
    this._socketServicio.ioSocket.on('notificacion', res => {
      this.getMisNotificacionesTienda();


    })
  }


  public async direccionar(codigo, tienda, idNotificacion, estado) {
    try {
      let response = await this._notificacionesServicio.updateEstadoNotificacion(idNotificacion, estado).toPromise();
      let identidadTienda = await this._tiendaServicio.getDatosTienda(tienda).toPromise();
      localStorage.setItem("identityTienda", JSON.stringify(identidadTienda.data));
      this.menu.getMisNotificacionesTienda();

      this.router.navigate(['/administrador/administrador-tienda/gestion-tienda/menu-gestion-tienda/gestionar-pedido/', codigo]);
    } catch (e) {

      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  public notificaciones;

  public async getMisNotificacionesTienda() {

    try {
      let response = await this._notificacionesServicio.getMisNotificacionesTienda(this.identidadTienda.NUM_TIENDA).toPromise();
      this.notificaciones = response.data;
      console.log("notificaciones", this.notificaciones)

    } catch (e) {

      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }

  }

  mensageError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Error..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        container: 'my-swal'
        //icon:'sm'
      }
    });
  }
}
