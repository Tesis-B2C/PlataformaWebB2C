import {Component, OnInit} from '@angular/core';
import {CompraServicio} from "../../../servicios/compra.servicio";
import {GLOBAL} from "../../../servicios/global";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {NgbModal, NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {ValoracionServicio} from "../../../servicios/valoracion.servicio";
import {HttpErrorResponse} from "@angular/common/http";
import * as jsPDF from 'jspdf'

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


  pdf(i, compra) {
    var doc = new jsPDF('p', 'px', 'a4');
    let element = document.getElementById('recibo' + i) as HTMLElement;
    doc.fromHTML("<h2> Detalles  del pedido No" + compra.NUM_COMPRA + "</h2>", 140, 10)
    doc.fromHTML("<p><strong>Pedido realizado:</strong>&nbsp;&nbsp;" + compra.FECHA_COMPRA + "</p>", 20, 50)
    doc.fromHTML("<p><strong>Pedido COMDERO No:</strong>&nbsp;&nbsp;" + compra.NUM_COMPRA + "</p>", 20, 70);
    doc.fromHTML("<p class='btn btn-link'><strong>Total del pedido:</strong>&nbsp;&nbsp;" + compra.total_final + "$</p>", 20, 90);
    doc.fromHTML("<h3><strong> Enviado el: &nbsp;</strong>" + compra.FECHA_ENVIO + "</h3>", 170, 110)
    doc.fromHTML("<h3><strong>&nbsp;&nbsp;Productos comprados</strong></h3>", 20, 140);

    for (let i in compra.COMPRA_PRODUCTOs) {
      if (compra.COMPRA_PRODUCTOs[i].VARIANTE.MATERIAL == null) {
        compra.COMPRA_PRODUCTOs[i].VARIANTE.MATERIAL = "";
      }
      if (compra.COMPRA_PRODUCTOs[i].VARIANTE.TALLA == null) {
        compra.COMPRA_PRODUCTOs[i].VARIANTE.TALLA = ""
      }

      if (compra.COMPRA_PRODUCTOs[i].VARIANTE.COLOR == null) {
        compra.COMPRA_PRODUCTOs[i].VARIANTE.COLOR = ""
      }
    }

    let cont = 140;
    for (let producto of compra.COMPRA_PRODUCTOs) {
      cont += 20;
      doc.fromHTML("<p>&nbsp;&nbsp;<strong>" + producto.VARIANTE.PRODUCTO.NOMBRE_PRODUCTO + "</strong>&nbsp;" + producto.VARIANTE.PRODUCTO.MARCA + " &nbsp; x &nbsp;" + producto.CANTIDAD_PRODUCTO + "<a> &nbsp;" + producto.VARIANTE.MEDIDA + "</a>," + " <a>&nbsp;" + producto.VARIANTE.MATERIAL + ",</a>"
        + " <a>&nbsp;" + producto.VARIANTE.MATERIAL + ",</a>" + " <a>" + producto.VARIANTE.TALLA + ",</a>&nbsp;" + " <a>" + producto.VARIANTE.COLOR + ",</a>" + " <strong> &nbsp;&nbsp;Estado:</strong>&nbsp;" + producto.VARIANTE.PRODUCTO.CONDICION + "</p>", 20, cont);

    }
    cont += 20;
    doc.fromHTML('<p><strong>&nbsp;&nbsp;Vendido por:</strong>&nbsp;' + compra.COMPRA_PRODUCTOs[0].VARIANTE.PRODUCTO.OFERTum.TIENDA.NOMBRE_COMERCIAL + "</p>", 20, cont);

    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML(" <h3><strong>Información de envío</strong></h3>", 20, cont)


    if (compra.METODO_ENVIO == 'Acordar') {
      compra.METODO_ENVIO = "Acordar con el vendedor"
    }

    if (compra.METODO_ENVIO == 'Retiro') {
      compra.METODO_ENVIO = "Retiro desde la tienda"
    }

    if (compra.METODO_ENVIO == 'Domicilio') {
      compra.METODO_ENVI = 'Envío a domicilio'
    }
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML(" <p><strong>&nbsp;&nbsp;Método de envío:</strong>&nbsp;&nbsp;" + "<label>" + compra.METODO_ENVIO + "</label>", 20, cont);
    ;
    if (compra.METODO_ENVIO == 'Domicilio') {
      if (compra.TIPO_IDENTIFICACION_ENTREGA == 'Persona') {
        compra.TIPO_IDENTIFICACION_ENTREGA = "Persona natural"
      }

      cont += 20;
      if(cont>550){
        doc.addPage();
        cont=10;
      }

      doc.fromHTML("<p><strong>Enviado a:</strong>&nbsp;</p>", 20, cont);
      cont += 20;
      if(cont>550){
        doc.addPage();
        cont=10;
      }

      doc.fromHTML(" <p>" + compra.TIPO_IDENTIFICACION_ENTREGA + "</p>", 20, cont);
      cont += 20;
      if(cont>550){
        doc.addPage();
        cont=10;
      }

      doc.fromHTML(" <p>" + compra.IDENTIFICACION_ENTREGA + "</p>", 20, cont)
      cont += 20;
      if(cont>550){
        doc.addPage();
        cont=10;
      }

      doc.fromHTML(" <p>" + compra.NOMBRE_PERSONA_ENTREGA + "</p>", 20, cont)
      cont += 20;
      if(cont>550){
        doc.addPage();
        cont=10;
      }

      doc.fromHTML(" <p>" + compra.TELEFONO_ENTREGA + "</p>", 20, cont)
      cont += 20;
      if(cont>550){
        doc.addPage();
        cont=10;
      }

      doc.fromHTML(" <p>" + compra.DPA.DPAP.NOMBRE + "</p>", 20, cont)
      cont += 20;
      if(cont>550){
        doc.addPage();
        cont=10;
      }

      doc.fromHTML(" <p>" + compra.DPA.NOMBRE + "</p>", 20, cont)
      cont += 20;
      if(cont>550){
        doc.addPage();
        cont=10;
      }

      doc.fromHTML(" <p>" + compra.CALLE_PRINCIPAL_ENTREGA + ",&nbsp;" + compra.CALLE_SECUNDARIA_ENTREGA + ",&nbsp;" + compra.NUM_CASA_ENTREGA + "</p>", 20, cont)
      cont += 20;
      if(cont>550){
        doc.addPage();
        cont=10;
      }

      doc.fromHTML(" <p><strong>Cod postal</strong> &nbsp;" + compra.NUM_COD_POSTAL_ENTREGA + "</p>", 20, cont)

    }


    if (compra.METODO_PAGO == 'Transferencia') {
      compra.METODO_PAGO = "Transferencia bancaria"
    }
    if (compra.METODO_PAGO == 'Electrónico') {

      compra.METODO_PAGO = 'PayPal';

    }
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML(" <h3><strong>Información de pago</strong></h3>", 20, cont)
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p><strong>&nbsp;&nbsp;Método de pago:</strong> <label>" + compra.METODO_PAGO + "</label></p>", 20, cont);

    if (compra.TIPO_IDENTIFICACION_FACTURA == 'Persona') {
      compra.TIPO_IDENTIFICACION_FACTURA = "Persona natural"
    }
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p><strong>&nbsp;&nbsp;Facturado a:</strong>&nbsp;</p>", 20, cont)
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML(" <p>" + compra.TIPO_IDENTIFICACION_FACTURA + "</p>", 20, cont);
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p>" + compra.NOMBRE_FACTURA + "</p>", 20, cont)
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p>" + compra.TELEFONO_FACTURA + "</p>", 20, cont)
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p>" + compra.DIRECCION_FACTURA + "</p>", 20, cont)

    cont += 50;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    let pageHeight = Math.round(doc.internal.pageSize.height);
    console.log("height aunmentando", cont, "el total", pageHeight)


    let pageWith = Math.round(doc.internal.pageSize.getWidth());

    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<h2>Detalles del pago</h2>", 190, cont)
    cont += 40;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<div><p><strong>Productos:</strong></p>", 40, cont)
    doc.fromHTML("<p>" + compra.productos + "$</p>", pageWith - 60, cont)
    cont += 20;
    if(cont>500){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p><strong>Impuestos:</strong></p>", 40, cont);
    doc.fromHTML("<p>" + compra.impuestos + "$</p>", pageWith - 60, cont)
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p><strong>Subtotal:</strong>$</p>", 40, cont)
    doc.fromHTML("<p>" + compra.subtotal + "$</p>", pageWith - 60, cont)
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p><strong>Descuento:</strong></p>", 40, cont)
    doc.fromHTML("<p>(-)&nbsp;" + compra.descuento + "$</p>", pageWith - 60, cont);
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p><strong>Descuento Cupón:</strong> </p>", 40, cont)
    doc.fromHTML("<p>(-)&nbsp;" + compra.cupon + "$</p>", pageWith - 60, cont)
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p><strong>Método de envio:</strong></p>", 40, cont)
    doc.fromHTML("<p>" + compra.COSTO_ENVIO + "$</p>", pageWith - 60, cont)
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p><strong>Método de pago:</strong></p>", 40, cont)
    doc.fromHTML("<p>" + compra.RECARGO_PAYPAL + "$</p>", pageWith - 60, cont)
    cont += 20;
    if(cont>550){
      doc.addPage();
      cont=10;
    }

    doc.fromHTML("<p><strong>Total del pedido:</strong></p>", 40, cont)
    doc.fromHTML("<p>" + compra.total_final + "$</p></div>", pageWith - 60, cont)


// Before adding new content


    /*doc.fromHTML(element, 2, 2);*/
    doc.output('save', 'Pedido#'+compra.NUM_COMPRA+'.pdf');
    /*  html2canvas(document.getElementById('recibo'+i), {scale: 2}).then(function (canvas) {
        var img = canvas.toDataURL("image/png");
        var context = canvas.getContext("2d");
        context.scale(2, 2);


        var doc = new jsPDF('p', 'px', 'a4');
        const imgProps= doc.getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', 15, 20);
        doc.save('Orden No'+codigo+'.pdf');
      });*/
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

  public loading: boolean;

  async updatePedido(idPedido, estado) {
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
