import {Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../../servicios/agente.servicio";
import {EstadisticasServicio} from "../../../servicios/estadisticas.servicio";
import {CompraServicio} from "../../../servicios/compra.servicio";
import {GLOBAL} from "../../../servicios/global";
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
@Component({
  selector: 'app-vision-general',
  templateUrl: './vision-general.component.html',
  styleUrls: ['./vision-general.component.css']
})
export class VisionGeneralComponent implements OnInit {
  public identidad;


  constructor(public _compraServicio: CompraServicio, public _estadisticasServicio: EstadisticasServicio, public _agenteServicio: AgenteServicio) {
  }

  ngOnInit() {
    this.identidad = this._agenteServicio.getIdentity();
    this.getEstadisticaCarrito();
    this.getEstadisticaPedidosRealizados();
    this.getMisCompras();
  }

  public carrito;

  async getEstadisticaCarrito() {
    try {
      let response = await this._estadisticasServicio.getEstadisticaCarrito(this.identidad.COD_AGENTE).toPromise();
      // console.log("esatdstica carrito", response.data);
      this.carrito = response.data;
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

  public pedidos;

  async getEstadisticaPedidosRealizados() {
    try {
      let response = await this._estadisticasServicio.getEstadisticaPedidosRealizados(this.identidad.COD_AGENTE).toPromise();
      // console.log("esatdstica carrito", response.data);
      this.pedidos = response.data;
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


  public comprasObtenidas;

  public error;

  public async getMisCompras() {
    this.comprasObtenidas = null;

    this.error = null;
    try {
      let response = await this._compraServicio.getMisComprasRecientes().toPromise();
      this.comprasObtenidas = response.data;
      // console.log("compras recientes", this.comprasObtenidas);
      for (let compra of this.comprasObtenidas) {
        let total_final = 0;

        for (let producto of compra.COMPRA_PRODUCTOs) {
          total_final = total_final + producto.SUBTOTAL - producto.DESCUENTOS - producto.CUPON;
        }
        compra.productos
        compra.total_final = total_final + compra.COSTO_ENVIO + compra.RECARGO_PAYPAL;
      }
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
