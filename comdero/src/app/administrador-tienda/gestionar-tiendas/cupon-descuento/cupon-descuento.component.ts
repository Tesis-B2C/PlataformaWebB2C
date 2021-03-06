import {Component, OnInit, DoCheck, OnDestroy} from '@angular/core';

import {Descuento} from "../../../modelos/descuento";
import {defineLocale} from 'ngx-bootstrap/chronos';
import {esLocale} from 'ngx-bootstrap/locale';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductoServicio} from "../../../servicios/producto.servicio";
import {DescuentoServicio} from "../../../servicios/descuento.servicio";
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {HttpErrorResponse} from "@angular/common/http";
defineLocale('es', esLocale);

@Component({
  selector: 'app-cupon-descuento',
  templateUrl: './cupon-descuento.component.html',
  styleUrls: ['./cupon-descuento.component.css'],
  providers: [DatePipe]

})
export class CuponDescuentoComponent implements OnInit , OnDestroy{


  public Descuento: Descuento
  public banderaValidaciones: boolean = false;
  public banderaOpcionAplicarA: boolean = true;
  public page = 1;
  public pageSize = 10;
  public page2 = 1;
  public pageSize2 = 10;
  public busqueda;
  public banderaCuponDescuento: boolean = true;
  public vectorProductos = new Set();


  public objDescuento = {
    Descuento: null,
    vProductos: null
  };

  public loading: boolean = false;
  public bsRangeValue: Date[];
  public minDate = new Date();

  public identidadTienda;
  public misProductos;
  public result = [];

  constructor(public datePipe: DatePipe, public router: Router, public toastr: ToastrService, public _descuentoServicio: DescuentoServicio, public modalService: NgbModal, public _productoServicio: ProductoServicio) {
    this.Descuento = new Descuento(null, null, null, null, 'Cupón', null, null, 0, 'todos');


  }

  search(text: string): any[] {
    return this.misProductos.filter(producto => {
      const term = text.toLowerCase();
      debugger
      return producto.PRODUCTO.NOMBRE_PRODUCTO.toLowerCase().includes(term)  // || siguiente
    });
  }


  async ngOnInit() {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    let response = await this._productoServicio.getMisProductos(this.identidadTienda.NUM_TIENDA).toPromise();
    this.misProductos = response.data;
    debugger;
    this.result = this.misProductos;
    // console.log("mis productos", this.misProductos);
    for (let i in this.result) {
      this.vectorProductos.add(this.result[i]);
    }
    for (let producto of this.vectorProductos) {
      this.vectorProductosEnviar.push(producto);
    }

    this.minDate.setDate(this.minDate.getDate());
  }

  ngOnDestroy() {

    delete this.Descuento;
  }

  async filtrar() {
    this.result = await this.search(this.busqueda);
  }

  public obtenerFecha(fecha) {

    fecha.setHours(0, 0, 0);
    // console.log("fecha ", fecha)
    return fecha.toISOString().split('T')[0]

  }

  opcionAplicarA(value) {
    debugger;
    this.banderaOpcionAplicarA = value;
    if (this.banderaOpcionAplicarA) {
      this.Descuento.AplicarA = 'todos';
      //this.vectorProductos = new Set();
      this.vectorProductosEnviar = [];
      for (let i in this.result) {
        this.vectorProductos.add(this.result[i]);
      }
      for (let producto of this.vectorProductos) {
        this.vectorProductosEnviar.push(producto);
      }

    } else {
      this.Descuento.AplicarA = 'especificos';
      this.vectorProductos = new Set();
      this.vectorProductosEnviar = [];
    }
  }


  public abrirModalProductos(content) {
    this.modalService.open(content, {centered: true, size: 'lg', scrollable: true});
    for (let producto of this.vectorProductosEnviar) {
      this.vectorProductos.add(producto);
    }
  }

  public cambiarOpcionDescuento(value) {
    this.banderaCuponDescuento = value;
    this.Descuento.Motivo_Descuento = "";

    if (this.banderaCuponDescuento) {
      this.Descuento.Tipo_Descuento = "Cupón";
    } else if (!this.banderaCuponDescuento) {
      this.Descuento.Tipo_Descuento = "Automático";
    }

  }

  public generarCodigDeswcuento() {
    this.Descuento.Motivo_Descuento = this.makeid(8);

  }

  public makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public agregarTodosProductos(event) {
    if (event.target.checked) {
      debugger
      for (let i in this.result) {
        this.vectorProductos.add(this.result[i]);
      }
      //console.log("vector productos", this.vectorProductos)


    } else {
      this.vectorProductos = new Set();
    }

  }


  public agregarProducto(event, cod) {
    if (event.target.checked) {
      debugger
      this.vectorProductos.add(cod);
      // console.log("vector productos", this.vectorProductos)
    } else {
      this.vectorProductos.delete(cod);
    }
  }


  vectorProductosEnviar = []

  public agregar() {
    this.vectorProductosEnviar = [];
    for (let producto of this.vectorProductos) {

      this.vectorProductosEnviar.push(producto);
    }
  }

  public borrar(producto) {
    this.vectorProductos.delete(producto)
    this.vectorProductosEnviar = [];
    for (let producto of this.vectorProductos) {
      this.vectorProductosEnviar.push(producto);
    }
  }

  public async guardarDescuento() {

    try {
      this.loading = true;
      this.banderaValidaciones = true;
      if (document.forms["formInformacion"].checkValidity() && document.forms["formDescuento"].checkValidity() && document.forms["formTiempo"].checkValidity()) {


        if (this.banderaOpcionAplicarA == false) {
          if (this.vectorProductosEnviar.length > 0) {
            this.Descuento.Fecha_Inicio = this.obtenerFecha(this.bsRangeValue[0]);
            this.Descuento.Fecha_FIn = this.obtenerFecha(this.bsRangeValue[1]);
            // console.log("Descuento antes de enviar ", this.Descuento, "productos", this.vectorProductosEnviar);
            this.objDescuento.Descuento = this.Descuento;
            this.objDescuento.vProductos = this.vectorProductosEnviar;
            let response = await this._descuentoServicio.saveDescuento(this.identidadTienda.NUM_TIENDA, this.objDescuento).toPromise();
            this.mensageCorrecto(response.message);
            this.router.navigate(['/administrador/administrador-tienda/gestion-tienda/menu-gestion-tienda/listado-cupon-descuento'])
            this.loading = false;
          } else {
            this.toastr.error('<div class="row no-gutters"><p class="col-10 LetrasToastInfo">Elige al menos un producto</p></div>', "Error!",
              {positionClass: 'toast-top-right', enableHtml: true, closeButton: true, disableTimeOut: false});
            this.loading = false;
          }
        } else {
          if (this.vectorProductosEnviar.length > 0) {
            this.Descuento.Fecha_Inicio = this.obtenerFecha(this.bsRangeValue[0]);
            this.Descuento.Fecha_FIn = this.obtenerFecha(this.bsRangeValue[1]);
            // console.log("Descuento antes de enviar ", this.Descuento, "productos", this.vectorProductosEnviar);
            this.objDescuento.Descuento = this.Descuento;
            this.objDescuento.vProductos = this.vectorProductosEnviar;
            // console.log("Descuento antes de enviar ", this.Descuento, "productos", this.vectorProductosEnviar);
            let response = await this._descuentoServicio.saveDescuento(this.identidadTienda.NUM_TIENDA, this.objDescuento).toPromise();
            this.mensageCorrecto(response.message);
            this.loading = false;
            this.router.navigate(['/administrador/administrador-tienda/gestion-tienda/menu-gestion-tienda/listado-cupon-descuento'])
          }else {
            this.toastr.error('<div class="row no-gutters"><p class="col-10 LetrasToastInfo">Al parecer no existen productos registrados en tu tienda</p></div>', "Error!",
              {positionClass: 'toast-top-right', enableHtml: true, closeButton: true, disableTimeOut: false});
            this.loading = false;
          }
        }
      } else {
        this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo">Existe errores en el formulario por favor revísalo nuevamente</p></div>', "Error!",
          {positionClass: 'toast-top-right', enableHtml: true, closeButton: true, disableTimeOut: false});
        let body = document.getElementById('body') as HTMLElement;
        body.scrollTo(0, 0);
        window.scroll(0, 0);
        this.loading = false;
      }
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
