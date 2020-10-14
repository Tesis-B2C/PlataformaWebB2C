import {Component, OnInit} from '@angular/core';
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {GLOBAL} from 'src/app/servicios/global';
import * as moment from "moment";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-inicio-tienda',
  templateUrl: './inicio-tienda.component.html',
  styleUrls: ['./inicio-tienda.component.css'],
  providers: [NgbRatingConfig]
})
export class InicioTiendaComponent implements OnInit {
  public idTienda;
  public Tienda: any;
  currentRate = 1;

  public page = 1;
  public pageSize = 15;
  public result = [];

  public loading: boolean = false;
  public busqueda;

  constructor(configRating: NgbRatingConfig, public _tiendaServicio: TiendaServicio, public route: ActivatedRoute, public router: Router) {
    configRating.max = 5;
    configRating.readonly = true;
    // customize default values of carousels used by this component tree

  }

  async ngOnInit() {
    this.loading = true;
    await this.getDetalleTiendaProducto();

    this.asignarVariables();
    console.log(JSON.stringify(this.result) + 'JJJ');
    this.loading = false;
  }

  async getDetalleTiendaProducto() {
    try {
      this.idTienda = this.route.parent.snapshot.params.id;
      let response = await this._tiendaServicio.getDetalleTiendaProducto(this.idTienda).toPromise();
      this.Tienda = response.data;
      // console.log("tienda buscada en inicio pilas", this.Tienda);
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


  public vectorProductosObtenidos = [];

  public asignarVariables() {
    try {
      if (this.Tienda) {
        this.Tienda.OFERTA.forEach(elemnt => {
          let objProducto = {
            NOMBRE_PRODUCTO: null,
            PROMEDIO_CAL: null,
            TOTAL_COM: null,
            PRECIO_CON_IVA: null,
            IMAGEN: null,
            ID_OFERTA: null,
            ID_PRODUCTO: null,
            COD_PRODUCTO: null,
            DESCUENTO_AUTOMATICO: null
          }

          objProducto.NOMBRE_PRODUCTO = elemnt.PRODUCTO.NOMBRE_PRODUCTO;
          objProducto.ID_PRODUCTO = elemnt.PRODUCTO.ID_PRODUCTO;
          objProducto.COD_PRODUCTO = elemnt.PRODUCTO.COD_PRODUCTO;

          if (elemnt.PRODUCTO.CALIFICACIONs.length > 0)
            objProducto.PROMEDIO_CAL = elemnt.PRODUCTO.CALIFICACIONs[0].PROMEDIO_CAL;
          else
            objProducto.PROMEDIO_CAL = null;

          if (elemnt.PRODUCTO.COMENTARIOs.length > 0)
            objProducto.TOTAL_COM = elemnt.PRODUCTO.COMENTARIOs[0].TOTAL_COM;
          else
            objProducto.TOTAL_COM = null;

          objProducto.PRECIO_CON_IVA = ((elemnt.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO * elemnt.IVA) / 100) + elemnt.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO;
          objProducto.IMAGEN = elemnt.PRODUCTO.VARIANTEs[0].IMAGEN_PRODUCTOs[0].IMAGEN;
          objProducto.ID_OFERTA = elemnt.ID_OFERTA;
          objProducto.DESCUENTO_AUTOMATICO = this.buscarDescuentoAutomatico(elemnt.PRODUCTO.PRODUCTO_DESCUENTOs, objProducto.PRECIO_CON_IVA);
          this.vectorProductosObtenidos.push(objProducto);
        });
        this.result = this.vectorProductosObtenidos;
        // console.log(JSON.stringify(this.vectorProductosObtenidos) + 'hola');
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

  public asignarVariables2() {

    this.vectorProductosObtenidos = [];
    try {
      this.result.forEach(elemnt => {
        let objProducto = {
          NOMBRE_PRODUCTO: null,
          PROMEDIO_CAL: null,
          TOTAL_COM: null,
          PRECIO_CON_IVA: null,
          IMAGEN: null,
          ID_OFERTA: null,
          ID_PRODUCTO: null,
          COD_PRODUCTO: null,
          DESCUENTO_AUTOMATICO: null
        }

        objProducto.NOMBRE_PRODUCTO = elemnt.PRODUCTO.NOMBRE_PRODUCTO;
        objProducto.ID_PRODUCTO = elemnt.PRODUCTO.ID_PRODUCTO;
        objProducto.COD_PRODUCTO = elemnt.PRODUCTO.COD_PRODUCTO;

        if (elemnt.PRODUCTO.CALIFICACIONs.length > 0)
          objProducto.PROMEDIO_CAL = elemnt.PRODUCTO.CALIFICACIONs[0].PROMEDIO_CAL;
        else
          objProducto.PROMEDIO_CAL = null;

        if (elemnt.PRODUCTO.COMENTARIOs.length > 0)
          objProducto.TOTAL_COM = elemnt.PRODUCTO.COMENTARIOs[0].TOTAL_COM;
        else
          objProducto.TOTAL_COM = null;

        objProducto.PRECIO_CON_IVA = ((elemnt.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO * elemnt.IVA) / 100) + elemnt.PRODUCTO.VARIANTEs[0].PRECIO_UNITARIO;
        objProducto.IMAGEN = elemnt.PRODUCTO.VARIANTEs[0].IMAGEN_PRODUCTOs[0].IMAGEN;
        objProducto.ID_OFERTA = elemnt.ID_OFERTA;
        objProducto.DESCUENTO_AUTOMATICO = this.buscarDescuentoAutomatico(elemnt.PRODUCTO.PRODUCTO_DESCUENTOs, objProducto.PRECIO_CON_IVA);
        this.vectorProductosObtenidos.push(objProducto);
      });
      this.result = this.vectorProductosObtenidos;
      // console.log(JSON.stringify(this.vectorProductosObtenidos) + 'hola');
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


  public porcentajeDescuento = null;
  public PRECIO_UNITARIO_CON_IVA_DESCUENTO = null;

  public buscarDescuentoAutomatico(PRODUCTO_DESCUENTOs, PRECIO_CON_IVA) {
    let fechaHoy = moment().format("YYYY-MM-DD");
    let horaActual = moment().format("HH:mm:ss");
    // console.log('horaHoy' + horaActual + fechaHoy)
    if (PRODUCTO_DESCUENTOs.length > 0) {
      this.porcentajeDescuento = 0;
      this.PRECIO_UNITARIO_CON_IVA_DESCUENTO = 0;
      PRODUCTO_DESCUENTOs.forEach(descuentoAut => {
        if (descuentoAut.DESCUENTO.TIPO_DESCUENTO == 'Automático') {
          if (descuentoAut.DESCUENTO.FECHA_INICIO == fechaHoy) {
            if ((this.obtenerMinutos(horaActual) >= this.obtenerMinutos(descuentoAut.DESCUENTO.HORA_INICIO))) {
              //CUPON VALIDO
              this.porcentajeDescuento = this.porcentajeDescuento + descuentoAut.DESCUENTO.PORCENTAJE_DESCUENTO;
              // console.log('1XX' + horaActual + fechaHoy)
            }
          } else {
            if (descuentoAut.DESCUENTO.FECHA_FIN == fechaHoy) {
              if ((this.obtenerMinutos(horaActual) <= this.obtenerMinutos(descuentoAut.DESCUENTO.HORA_FIN))) {
                //CUPON VALIDO
                this.porcentajeDescuento = this.porcentajeDescuento + descuentoAut.DESCUENTO.PORCENTAJE_DESCUENTO;
                // console.log('2XX' + horaActual + fechaHoy);
              } else {
                //CUPON FUERA DE LA HORA
                this.porcentajeDescuento = this.porcentajeDescuento + 0;
              }
            } else {
              //CUPON VALIDO
              this.porcentajeDescuento = this.porcentajeDescuento + descuentoAut.DESCUENTO.PORCENTAJE_DESCUENTO;
              // console.log('3XX' + horaActual + fechaHoy);
            }
          }
        }
      })

      if (this.porcentajeDescuento > 0) {
        this.PRECIO_UNITARIO_CON_IVA_DESCUENTO = PRECIO_CON_IVA - ((PRECIO_CON_IVA * this.porcentajeDescuento) / 100);
      } else {
        this.PRECIO_UNITARIO_CON_IVA_DESCUENTO = null;
      }
    } else {
      this.porcentajeDescuento = null;
      this.PRECIO_UNITARIO_CON_IVA_DESCUENTO = null;
    }

    return this.PRECIO_UNITARIO_CON_IVA_DESCUENTO;
    // console.log(this.PRECIO_UNITARIO_CON_IVA_DESCUENTO + 'PRECIO DESCUENTO' + this.porcentajeDescuento + 'DESCUENTO');
  }

  public obtenerMinutos(hora) {
    if (hora) {
      var spl = hora.split(":");
      return parseInt(spl[0]) * 60 + parseInt(spl[1]);
    }
  }


  public noExiste;

  getImagen(pathImagen) {
    this.noExiste = 'assets/images/no-image.png';
    if (pathImagen) {
      this.noExiste = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExiste;
  }


  public async filtrar() {

    this.busqueda = this.busqueda.trim();
    this.loading = true;
    this.result = await this.search(this.busqueda);
    this.asignarVariables2();
    this.loading = false;
  }

  public search(text: string): any[] {
    if (this.Tienda) {
      return this.Tienda.OFERTA.filter(producto => {
        const term = text.toLowerCase();
        debugger
        if (producto.PRODUCTO.NOMBRE_PRODUCTO.toLowerCase().includes(term)) {
          return producto;
        }
        // || siguiente

      });
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
      //footer: '<a href="http://localhost:4200/loguin"><b><u>Autentificate Ahora</u></b></a>',
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }

}
