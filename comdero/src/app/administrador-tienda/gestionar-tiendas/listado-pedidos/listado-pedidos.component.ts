import {Component, OnInit} from '@angular/core';
import {CompraServicio} from "../../../servicios/compra.servicio";
import Swal from "sweetalert2";

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.css']
})
export class ListadoPedidosComponent implements OnInit {


  public page = 1;
  public pageSize = 10;
  public result = [];
  public estadoActivo = 0;
  public fechaActivaInicio = 0;
  public fechaActivaFin = 0;
  public misPedidos: any = [];
  public identidadTienda;

  public bsRangeValue: Date[];
  public minDate = new Date();

  public loading: boolean;
  public busqueda;

  constructor(public _compraServicio: CompraServicio) {
  }

  async ngOnInit() {
    console.log("leng", this.misPedidos.length)

    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    await this.getMisPedidos(this.estadoActivo, this.fechaActivaInicio, this.fechaActivaFin);

  }

  public async filtrar() {

    this.result = await this.search(this.busqueda);

  }

  public search(text: string): any[] {
    return this.misPedidos.filter(pedido => {
      const digito = text;
      const term = text.toLowerCase();

      return pedido.NUM_COMPRA == digito || pedido.AGENTE.NOMBRE.toLowerCase().includes(term)  // || siguiente
    });
  }


  async estado(estado) {
    this.page = 1;
    this.estadoActivo = estado;
    await this.getMisPedidos(this.estadoActivo, this.fechaActivaInicio, this.fechaActivaFin);
    if (this.busqueda) {
      await this.filtrar();
    }
  }

  async fecha(value: Date) {
    this.page = 1;
    console.log("fecha inicio", value)
    if (value) {
      this.fechaActivaInicio = this.obtenerFecha(value[0]);
      this.fechaActivaFin = this.obtenerFecha(value[1]);
    }
    await this.getMisPedidos(this.estadoActivo, this.fechaActivaInicio, this.fechaActivaFin);
    if (this.busqueda) {
      await this.filtrar();
    }
  }

  public obtenerFecha(fecha) {
    fecha.setHours(0, 0, 0);
    console.log("fecha ", fecha)
    return fecha.toISOString().split('T')[0]

  }

  public async getMisPedidos(estado, fechaInicio, fechaFin) {
    this.misPedidos = [];
    this.result = [];
    this.loading = true;
    try {
      let response = await this._compraServicio.getMisPedidos(estado, fechaInicio, fechaFin, this.identidadTienda.NUM_TIENDA).toPromise();
      this.misPedidos = response.data;
      console.log("PEDIDOS obtenidas", this.misPedidos);
      this.result = this.misPedidos;
      for (let compra of this.misPedidos) {
        let total_final = 0;
        let productos = 0;
        let impuestos = 0;
        let subtotal = 0;
        let descuento = 0;
        let cupon = 0;
        let peso = 0;


        for (let producto of compra.COMPRA_PRODUCTOs) {
          total_final = total_final + producto.SUBTOTAL - producto.DESCUENTOS - producto.CUPON;
          productos = productos + producto.TOTAL_PRODUCTOS;
          impuestos = impuestos + producto.IMPUESTOS;
          subtotal = subtotal + producto.SUBTOTAL;
          descuento = descuento + producto.DESCUENTOS;
          cupon = cupon + producto.CUPON;
          peso = peso + producto.VARIANTE.PRODUCTO.PESO_PRODUCTO;
        }
        compra.productos
        compra.total_final = total_final + compra.COSTO_ENVIO + compra.RECARGO_PAYPAL;
        compra.productos = productos;
        compra.impuestos = impuestos;
        compra.subtotal = subtotal;
        compra.descuento = descuento;
        compra.cupon = cupon;
        compra.peso = peso;
      }
      this.loading = false;
    } catch (e) {
      console.log("error Parseado:" + JSON.stringify(e));
      console.log("error como objeto:"+ e);
      if (JSON.stringify(e) === '{}')
        this.mensageError(e);
      else this.mensageError(JSON.stringify(e));

    }
  }


  public async limpiarFecha() {
    this.fechaActivaInicio = 0;
    this.fechaActivaFin = 0;
    this.bsRangeValue=null;
    await this.getMisPedidos(this.estadoActivo, this.fechaActivaInicio, this.fechaActivaFin);
    this.filtrar();
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
      //footer: '<a href="http://localhost:4200/loguin"><b><u>Autentificate Ahora</u></b></a>',
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }
}
