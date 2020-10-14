import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import Swal from "sweetalert2";
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import {HttpErrorResponse} from "@angular/common/http";
import {AgenteServicio} from "../../../servicios/agente.servicio";
import {WebSocketService} from "../../../servicios/WebSockets/web-socket.service";
import {NotificacionesServicio} from "../../../servicios/notificaciones.servicio";
import {NgxPushNotificationService} from "ngx-push-notification";
@Component({
  selector: 'app-menu-gestion-tiendas',
  templateUrl: './menu-gestion-tiendas.component.html',
  styleUrls: ['./menu-gestion-tiendas.component.css']
})
export class MenuGestionTiendasComponent implements OnInit{
  public banderaSideBar: boolean = false;
  public identidadTienda;

  constructor(private ngxPushNotificationService: NgxPushNotificationService, public _socketServicio:WebSocketService, public _notificacionesServicio: NotificacionesServicio,public _agenteServicio:AgenteServicio,public _tiendaServicio: TiendaServicio, public router: Router) {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
  }
  notify() {
    this.ngxPushNotificationService.showNotification({
      title: 'COMDERO',
      body: 'Nueva notificación',
      icon: 'assets/images/logoValid.png'
    }).subscribe((res: any) => {
      if (res.type === 'show') {
        console.log('show');
      } else if (res.type === 'click') {
        console.log('click');
      } else {
        console.log('close');
      }
    });
  }

  ngOnInit(): void {
    this.getMisNotificacionesTienda();
    this._socketServicio.ioSocket.on('notificacion', res => {
      this.getMisNotificacionesTienda();
      this.notify();

    })
  }

  public async  direccionar(codigo ,tienda, idNotificacion,estado,estado_notificacion){
    try {
      if(estado_notificacion==0){
      let response = await this._notificacionesServicio.updateEstadoNotificacion(idNotificacion,estado).toPromise();
      }
      let identidadTienda = await this._tiendaServicio.getDatosTienda(tienda).toPromise();
      localStorage.setItem("identityTienda", JSON.stringify(identidadTienda.data));
      this.getMisNotificacionesTienda();

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

  public notificaciones;
  public async getMisNotificacionesTienda() {

    try {
      let response = await this._notificacionesServicio.getMisNotificacionesTienda(this.identidadTienda.NUM_TIENDA).toPromise();
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
  abrirSideBar() {
    this.banderaSideBar = !this.banderaSideBar;
  }

  cerrarSideBar(){
    let body=document.getElementById('body') as HTMLElement;
    // console.log("tamanio",body.offsetWidth);
    if(body.offsetWidth<720){
      this.banderaSideBar = !this.banderaSideBar;
    }
  }
  public async updateEstadoTienda(estado) {
    Swal.fire({
      title: '<header class="login100-form-title-registro mb-o"><h5 class="card-title"><strong>!Estas seguro</strong></h5></header>',
      text: "Al ocultar la tienda, esta no será visible para los usuarios de la plataforma al igual que los productos que contenga, por otro lado la tienda podra ser recuperada en cualquier momento incluyendo sus productos",
      icon: 'warning',
      position: 'center',
      width: 600,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        container: 'my-swal',
        cancelButton: 'btn btn-secondary px-5 ml-5',
      }
    }).then(async (result) => {
      if (result.value) {
        try {
          let responseUpdate = await this._tiendaServicio.updateEstadoTienda(this.identidadTienda.NUM_TIENDA, estado).toPromise();
          this.mensageCorrecto(responseUpdate['menssage']);
          localStorage.removeItem("identityTienda");
          this.router.navigate(['/administrador/administrador-tienda/mis-tiendas'])


        } catch (e) {
          if (!(e instanceof HttpErrorResponse)){
            console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
            console.log("error como objeto:"+ e);
            if (JSON.stringify(e) === '{}')
              this.mensageError(e);
            else this.mensageError(JSON.stringify(e));
          }
        }
      }
    })


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


  mensageCorrecto(mensaje) {
    Swal.fire({
      icon: 'success',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Correcto..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,

      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }

}
