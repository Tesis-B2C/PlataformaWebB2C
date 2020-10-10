import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {NotificacionesServicio} from "../../servicios/notificaciones.servicio";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {Router} from "@angular/router";

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  constructor(public router: Router,public _tiendaServicio:TiendaServicio,public _notificacionesServicio:NotificacionesServicio) { }

  ngOnInit() {
    this.getMisNotificaciones();
  }


  public async  direccionar(codigo ,tienda){
    let identidadTienda = await this._tiendaServicio.getDatosTienda(tienda).toPromise();
    localStorage.setItem("identityTienda", JSON.stringify(identidadTienda.data));
    this.router.navigate(['/administrador/administrador-tienda/gestion-tienda/menu-gestion-tienda/gestionar-pedido/',codigo]);
  }

  public notificaciones;

  public async getMisNotificaciones() {

    try {
      let response = await this._notificacionesServicio.getMisNotificaciones().toPromise();
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
