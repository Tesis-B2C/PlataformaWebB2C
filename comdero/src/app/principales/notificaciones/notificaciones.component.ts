import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {NotificacionesServicio} from "../../servicios/notificaciones.servicio";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {Router} from "@angular/router";
import {WebSocketService} from "../../servicios/WebSockets/web-socket.service";
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  constructor(public menu: MenuComponent,public _socketServicio:WebSocketService, public router: Router,public _tiendaServicio:TiendaServicio,public _notificacionesServicio:NotificacionesServicio) { }

  ngOnInit() {
    this.getMisNotificaciones();
    this._socketServicio.ioSocket.on('notificacion', res => {
      this.getMisNotificaciones();


    })
  }


  public async  direccionar(codigo ,tienda, idNotificacion,estado){
    try {
      let response = await this._notificacionesServicio.updateEstadoNotificacion(idNotificacion,estado).toPromise();
      let identidadTienda = await this._tiendaServicio.getDatosTienda(tienda).toPromise();
      localStorage.setItem("identityTienda", JSON.stringify(identidadTienda.data));
       this.menu.getMisNotificaciones();
      this.router.navigate(['/administrador/administrador-tienda/gestion-tienda/menu-gestion-tienda/gestionar-pedido/',codigo]);
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

  public async direccionar2( idCompra, idNotificacion, estado,estado_notificacion) {
    try {
      if (estado_notificacion == 0) {
        let response = await this._notificacionesServicio.updateEstadoNotificacion(idNotificacion, estado).toPromise();
      }
      this.router.navigate(['/principales/menu/mi-cuenta/menu-mi-cuenta/detalle-pedido-realizado/',idCompra]);
      this.getMisNotificaciones();
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

  public async getMisNotificaciones() {

    try {
      let response = await this._notificacionesServicio.getMisNotificaciones().toPromise();
      this.notificaciones = response.data;
      // console.log("notificaciones", this.notificaciones)

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
