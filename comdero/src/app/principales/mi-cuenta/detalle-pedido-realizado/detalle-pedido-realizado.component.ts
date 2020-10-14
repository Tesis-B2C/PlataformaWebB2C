import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {CompraServicio} from "../../../servicios/compra.servicio";
import {ActivatedRoute} from "@angular/router";
import {GLOBAL} from "../../../servicios/global";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Component({
  selector: 'app-detalle-pedido-realizado',
  templateUrl: './detalle-pedido-realizado.component.html',
  styleUrls: ['./detalle-pedido-realizado.component.css']
})
export class DetallePedidoRealizadoComponent implements OnInit {
  public comprasObtenida;
  public bandera:boolean=true;
  constructor(public route: ActivatedRoute,public _compraServicio: CompraServicio) {
  }

  public idCompra;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idCompra = params['id'];
      this.getCompra();
      this.bandera=true;
    });

  }

  public compra;
  public async getCompra() {
    try {
      let response = await this._compraServicio.getCompra(this.idCompra).toPromise();
      this.comprasObtenida = response.data;
      this.compra = this.comprasObtenida;
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
      this.compra.productos;
      this.compra.total_final = total_final + this.compra.COSTO_ENVIO + this.compra.RECARGO_PAYPAL;
      this.compra.productos = productos;
      this.compra.impuestos = impuestos;
      this.compra.subtotal = subtotal;
      this.compra.descuento = descuento;
      this.compra.cupon = cupon;

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

  public noExite;
  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-image.png';
    if (pathImagen) {
      this.noExite = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExite;
  }


  pdf(codigo) {
    html2canvas(document.getElementById('recibo'), {scale: 2}).then(function (canvas) {
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
