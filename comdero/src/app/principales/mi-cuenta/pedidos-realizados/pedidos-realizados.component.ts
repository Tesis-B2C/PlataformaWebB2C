import {Component, OnInit} from '@angular/core';
import {CompraServicio} from "../../../servicios/compra.servicio";
import {GLOBAL} from "../../../servicios/global";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {NgbModal, NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {ValoracionServicio} from "../../../servicios/valoracion.servicio";
import {HttpErrorResponse} from "@angular/common/http";
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pedidos-realizados',
  templateUrl: './pedidos-realizados.component.html',
  styleUrls: ['./pedidos-realizados.component.css']
})
export class PedidosRealizadosComponent implements OnInit {
  public comprasObtenidas;
  public noExite;


  public page = 1;
  public pageSize = 3;
  public result = [];
  public estadoActivo = 0;
  public fechaActiva = 1;

  public calificacion = 0;
  public comentario;

  constructor(public configRating2: NgbRatingConfig, public modalService: NgbModal, public toastr: ToastrService, public _compraServicio: CompraServicio, public _valoracionServicio: ValoracionServicio) {
    configRating2.readonly = false;
  }


  pdf(i, codigo) {
    html2canvas(document.getElementById('recibo'+i), {scale: 2}).then(function (canvas) {
      var img = canvas.toDataURL("image/png");
      var context = canvas.getContext("2d");
      context.scale(2, 2);


      var doc = new jsPDF('p', 'mm', 'a4');
      const imgProps= doc.getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', 15, 20, pdfWidth-30, pdfHeight);
      doc.save('Orden No'+codigo+'.pdf');
    });
  }


  async ngOnInit() {

    await this.getMisCompras(this.estadoActivo, this.fechaActiva);
  }

  estado(estado) {
    this.page = 1;
    this.estadoActivo = estado;
    this.getMisCompras(this.estadoActivo, this.fechaActiva);
  }

  fecha(fecha) {
    this.page = 1;
    this.fechaActiva = fecha;
    this.getMisCompras(this.estadoActivo, this.fechaActiva);
  }

  public async getMisCompras(estado, fecha) {
    this.comprasObtenidas = null;
    this.result = [];

    try {
      let response = await this._compraServicio.getMisCompras(estado, fecha).toPromise();
      this.comprasObtenidas = response.data;
      // console.log("comra obtenidas", this.comprasObtenidas);
      this.result = this.comprasObtenidas;
      for (let compra of this.comprasObtenidas) {
        let total_final = 0;
        let productos = 0;
        let impuestos = 0;
        let subtotal = 0;
        let descuento = 0;
        let cupon = 0;


        for (let producto of compra.COMPRA_PRODUCTOs) {
          total_final = total_final + producto.SUBTOTAL - producto.DESCUENTOS - producto.CUPON;
          productos = productos + producto.TOTAL_PRODUCTOS;
          impuestos = impuestos + producto.IMPUESTOS;
          subtotal = subtotal + producto.SUBTOTAL;
          descuento = descuento + producto.DESCUENTOS;
          cupon = cupon + producto.CUPON;

        }
        compra.productos
        compra.total_final = total_final + compra.COSTO_ENVIO + compra.RECARGO_PAYPAL;
        compra.productos = productos;
        compra.impuestos = impuestos;
        compra.subtotal = subtotal;
        compra.descuento = descuento;
        compra.cupon = cupon;
      }
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

  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-image.png';
    if (pathImagen) {
      this.noExite = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExite;
  }

  public  loading: boolean;

  async  updatePedido(idPedido, estado) {
    this.loading = true;
    try {
      let response = await this._compraServicio.updateEstadoPedido(idPedido, estado).toPromise();
      let mensaje = response.message;
      this.toastr.success(JSON.stringify(mensaje), 'Correcto', {
        positionClass: 'toast-top-right',
        enableHtml: true,
        closeButton: true
      });
      this.loading = false;
    } catch (e) {
      this.loading = false;
      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }


  abrirModalCalificacion(content) {
    this.calificacion = 0;
    this.modalService.open(content, {centered: true, windowClass: 'animated backInDown'});
  }

  public id_producto;
  public cod_producto;

  productoActivo(id_producto, cod_producto) {
    this.comentario = null;
    this.calificacion = 0;
    this.id_producto = id_producto;
    this.cod_producto = cod_producto;
  }

  public async saveValoracion() {

    let objValoracion = {
      ID_PRODUCTO: this.id_producto,
      COD_PRODUCTO: this.cod_producto,
      COMENTARIO: this.comentario,
      CALIFICACION: this.calificacion
    }
    try {
      let response = await this._valoracionServicio.saveValoracion(objValoracion).toPromise();
      this.mensageCorrecto(response.message);
      this.id_producto;
      this.cod_producto;
      this.comentario = null;
      this.calificacion = 0;
      await this.getMisCompras(this.estadoActivo, this.fechaActiva);
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
