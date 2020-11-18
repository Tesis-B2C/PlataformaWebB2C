import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {ActivatedRoute, Router} from "@angular/router";
import {AgenteServicio} from "../../servicios/agente.servicio";
import {CarritoServicio} from "../../servicios/carrito.servicio";
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificacionesServicio} from "../../servicios/notificaciones.servicio";
import {WebSocketService} from "../../servicios/WebSockets/web-socket.service";
import { NgxPushNotificationService } from 'ngx-push-notification';
import { PushNotificationOptions, PushNotificationService } from 'ngx-push-notifications';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class MenuComponent implements OnInit, OnDestroy {
  public tipoBuscador = "Todos";
  public palabraBuscadora = "";

  public objetoDatos = [];
  public datosObtenidos: any;
  public carritoIdentidad;

  constructor(private _pushNotificationService: PushNotificationService,public ngxPushNotificationService: NgxPushNotificationService, public _socketServicio: WebSocketService, public _notificacionesServicio: NotificacionesServicio, public _carritoServicio: CarritoServicio, public _agenteServicio: AgenteServicio, public route: ActivatedRoute, public _tiendaServicio: TiendaServicio, public router: Router) {
  }




  async ngOnInit() {
    this._pushNotificationService.requestPermission();

    // console.log("user", JSON.stringify(this._agenteServicio.getIdentity()));
    if (this._agenteServicio.getIdentity()) {
      this.conteoProductosCarrito(false);


      this.getMisNotificaciones();
      this._socketServicio.ioSocket.on('notificacion', res => {
        this.getMisNotificaciones();
        this.notify();
      })
    }
  }


  myFunction() {
    const title = 'Hello';
    const options = new PushNotificationOptions();
    options.body = 'Native Push Notification';

    this._pushNotificationService.create(title, options).subscribe((notif) => {
        if (notif.event.type === 'show') {
          console.log('onshow');
          setTimeout(() => {
            notif.notification.close();
          }, 3000);
        }
        if (notif.event.type === 'click') {
          console.log('click');
          notif.notification.close();
        }
        if (notif.event.type === 'close') {
          console.log('close');
        }
      },
      (err) => {
        console.log(err);
      });
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
  public async direccionar(codigo, tienda, idNotificacion, estado, estado_notificacion) {
    try {
      if (estado_notificacion == 0) {
        let response = await this._notificacionesServicio.updateEstadoNotificacion(idNotificacion, estado).toPromise();
      }
      let identidadTienda = await this._tiendaServicio.getDatosTienda(tienda).toPromise();
      localStorage.setItem("identityTienda", JSON.stringify(identidadTienda.data));

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

  public banderaCarrito: boolean;

  public async conteoProductosCarrito(bandera) {
    this.banderaCarrito = bandera;
    try {
      this.carritoIdentidad = await this._carritoServicio.getCarrito().toPromise();
      // console.log("OBTENIENDO carrito", this.carritoIdentidad.data);

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

  ngOnDestroy() {
    delete this.objetoDatos;
    delete this.tipoBuscador;
    delete this.palabraBuscadora;
    delete this.datosObtenidos;
  }

  public cambiarBuscador(busqueda) {
    this.tipoBuscador = busqueda;
  }

  public async buscarDatos(palabraBuscar) {
    this.objetoDatos = [];
    this.datosObtenidos = '';
    palabraBuscar = palabraBuscar.trim();
    if (palabraBuscar != 0) {
      if (this.tipoBuscador == 'Tiendas' && palabraBuscar != '') {
        let response = await this._tiendaServicio.obtenerFiltroPrincipalTienda(palabraBuscar).toPromise();
        this.datosObtenidos = response.data;
        this.datosObtenidos.forEach(elemnt => {
          this.objetoDatos.push(elemnt.NOMBRE_COMERCIAL)
        })
      }

      if (this.tipoBuscador == 'Productos' && palabraBuscar != '') {
        let response = await this._tiendaServicio.obtenerFiltroPrincipalProductos(palabraBuscar).toPromise();
        this.datosObtenidos = response.data;
        this.datosObtenidos.forEach(elemnt => {
          this.objetoDatos.push(elemnt.PRODUCTO.NOMBRE_PRODUCTO);
        })
      }

      if (this.tipoBuscador == 'Todos' && palabraBuscar != '') {
        let response = await this._tiendaServicio.obtenerFiltroPrincipalTodos(palabraBuscar).toPromise();
        this.datosObtenidos = response.data;
        // console.log('DATOS' + JSON.stringify(this.datosObtenidos))
        this.datosObtenidos[0].forEach(elemnt => {
          this.objetoDatos.push(elemnt.NOMBRE_COMERCIAL);
        })

        this.datosObtenidos[1].forEach(elemnt => {
          this.objetoDatos.push(elemnt.PRODUCTO.NOMBRE_PRODUCTO.toUpperCase());
        });


      }
    }
    // console.log("ordenado", this.objetoDatos.sort());
  }

  buscarDatosTerm = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? [] :
        this.objetoDatos.filter(v => v.toLowerCase().indexOf(term.toLowerCase().trim()) > -1).slice(0, 30))
    )

  public buscarPalabra(palabraBuscada: string) {
    if (palabraBuscada.trim() == "" || palabraBuscada.trim() == null) {
      console.log(palabraBuscada.trim() + "ya mismo me voy");
      this.router.navigate(['**']);
    } else {
      palabraBuscada = palabraBuscada.trim();
      this.router.navigate(['principales/menu/busqueda/' + palabraBuscada]);
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
