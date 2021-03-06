import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompraServicio} from "../../../servicios/compra.servicio";
import {GLOBAL} from "../../../servicios/global";
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {CorreoServicio} from "../../../servicios/correo.servicio";
@Component({
  selector: 'app-gestionar-pedido',
  templateUrl: './gestionar-pedido.component.html',
  styleUrls: ['./gestionar-pedido.component.css']
})
export class GestionarPedidoComponent implements OnInit {
  public idPedido;
  public compra;

  constructor(public _correoServicio:CorreoServicio,public _compraServicio: CompraServicio, public router: Router, public route: ActivatedRoute) {
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.idPedido = params['id'];
      this.getPedido();
    })

  }

  ngOnChanges() {
    this.route.params.subscribe(params => {
      this.idPedido = params['id'];
      this.getPedido();
    })
  }

  async getPedido() {

    try {
      let response = await this._compraServicio.getPedido(this.idPedido).toPromise();
      this.compra = response.data;
      let total_final = 0;
      let productos = 0;
      let impuestos = 0;
      let subtotal = 0;
      let descuento = 0;
      let cupon = 0;


      for (let producto of this.compra.COMPRA_PRODUCTOs) {
        total_final = total_final + producto.SUBTOTAL - producto.DESCUENTOS - producto.CUPON;
        productos = productos + producto.TOTAL_PRODUCTOS;
        impuestos = impuestos + producto.IMPUESTOS;
        subtotal = subtotal + producto.SUBTOTAL;
        descuento = descuento + producto.DESCUENTOS;
        cupon = cupon + producto.CUPON;

      }
      this.compra.productos
      this.compra.total_final = total_final + this.compra.COSTO_ENVIO + this.compra.RECARGO_PAYPAL;
      this.compra.productos = productos;
      this.compra.impuestos = impuestos;
      this.compra.subtotal = subtotal;
      this.compra.descuento = descuento;
      this.compra.cupon = cupon;
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

  public noExite;

  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-image.png';
    if (pathImagen) {
      this.noExite = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExite;
  }

  public loading: boolean;

  async updatePedido(estado) {
    this.loading = true;
    try {
      let response = await this._compraServicio.updateEstadoPedido(this.idPedido, estado).toPromise();
      this.mensageCorrecto(response.message);
      this._correoServicio.correoPedidoTramitado(response.data).toPromise();
      this.router.navigate(['/administrador/administrador-tienda/gestion-tienda/menu-gestion-tienda/listado-pedidos'])
      this.loading = false;
    } catch (e) {
      this.loading = false;
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
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
