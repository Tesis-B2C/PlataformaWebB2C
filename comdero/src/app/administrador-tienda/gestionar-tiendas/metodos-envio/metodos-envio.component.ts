import {Component, OnDestroy, OnInit} from '@angular/core';
import {Opcion_Envio} from "../../../modelos/opcion_envio";
import {CurrencyPipe} from "@angular/common";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from "ngx-toastr";
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import Swal from "sweetalert2";
import {MetodoEnvioServicio} from "../../../servicios/metodo_envio.servicio";
import {HttpErrorResponse} from "@angular/common/http";
@Component({
  selector: 'app-metodos-envio',
  templateUrl: './metodos-envio.component.html',
  styleUrls: ['./metodos-envio.component.css'],
  providers: [CurrencyPipe]
})

export class MetodosEnvioComponent implements OnInit, OnDestroy {
  public banderaRetiroLocal: boolean = false;
  public banderaEnvioDomicilio: boolean = false;
  public banderaslideRetiroLocal;
  public banderaslideEnvioDomicilio;
  public banderaEdicionDeshabilitada: boolean = false;

  public objetoRetiroLocal;

  public vectorTotal = [];

  public objetoAuxiliarLocal;
  public vectorTarifasLocal = [];
  public banderaTarifaLocalPeso: boolean = true;
  public banderaTarifaLocalPrecio: boolean = false;

  public objetoAuxiliarResto;
  public vectorTarifasResto = [];
  public banderaTarifaRestoPeso: boolean = true;
  public banderaTarifaRestoPrecio: boolean = false;

  public banderaTipoAccionLocal;
  public banderaTipoAccionResto;

  public identidadTienda;
  public loading: boolean = false;

  constructor(public toastr: ToastrService, public _tiendaServicio: TiendaServicio, public _metodoEnvioServicio: MetodoEnvioServicio, public cp: CurrencyPipe, public modalService: NgbModal) {
  }


  ngOnInit() {
    this.identidadTienda = this._tiendaServicio.getIdentityTienda();
    this.iniciarEdicion();
  }

  ngOnDestroy() {
    delete this.objetoAuxiliarLocal;
    delete this.vectorTarifasLocal;
    delete this.objetoAuxiliarResto;
    delete this.vectorTarifasResto;
    delete this.objetoRetiroLocal;
  }

  public clickEnvioDomicilio(event) {
    if (event.target.checked) {
      this.banderaEnvioDomicilio = true;
    } else {
      this.banderaEnvioDomicilio = false;
    }
  }

  public clickRetiroLocal(event) {
    if (event.target.checked) {
      this.banderaRetiroLocal = true;
    } else {
      this.banderaRetiroLocal = false;
    }
  }

  //INICIO RETIRO LOCAL

  //FIN RETIRO LOCAL

  //Envio a domicilio LOCAL
  public abrirModalLocal(modalLocal) {
    this.objetoAuxiliarLocal = new Opcion_Envio('Domicilio', 'Local', 'Peso', null, null, 0, 999.99, 0);
    this.banderaTarifaLocalPeso = true;
    this.banderaTarifaLocalPrecio = false;
    this.banderaTipoAccionLocal = 'Agregar';
    this.modalService.open(modalLocal, {centered: true, size: 'md', backdrop: "static"});
  }

  public opcTarifaLocal(opcion, event) {
    if (opcion == 'peso' && event.target.checked) {
      this.objetoAuxiliarLocal.Tipo_Medida = 'Peso';
      this.banderaTarifaLocalPeso = true;
      this.banderaTarifaLocalPrecio = false;
    }

    if (opcion == 'precio' && event.target.checked) {
      this.objetoAuxiliarLocal.Tipo_Medida = 'Precio';
      this.banderaTarifaLocalPeso = false;
      this.banderaTarifaLocalPrecio = true;
    }
  }

  public cancelarTarifaLocal() {
    this.banderaTipoAccionLocal = '';
    this.banderaTarifaLocalPeso = false;
    this.banderaTarifaLocalPrecio = false;
  }

  public agregarTarifaLocal() {
    this.vectorTarifasLocal.push(new Opcion_Envio(this.objetoAuxiliarLocal.Tipo_Envio, this.objetoAuxiliarLocal.Tipo_Ubicacion, this.objetoAuxiliarLocal.Tipo_Medida, null, null, this.objetoAuxiliarLocal.Minimo, this.objetoAuxiliarLocal.Maximo, this.objetoAuxiliarLocal.Precio));
  }

  public indiceEditarLocal = 0;

  public editarTarifaLocal() {
    this.vectorTarifasLocal[this.indiceEditarLocal].Tipo_Medida = this.objetoAuxiliarLocal.Tipo_Medida;
    this.vectorTarifasLocal[this.indiceEditarLocal].Minimo = this.objetoAuxiliarLocal.Minimo;
    this.vectorTarifasLocal[this.indiceEditarLocal].Maximo = this.objetoAuxiliarLocal.Maximo;
    this.vectorTarifasLocal[this.indiceEditarLocal].Precio = this.objetoAuxiliarLocal.Precio;
  }

  public editarAbrirTarifaLocal(indice, modalLocal) {
    this.objetoAuxiliarLocal = "";
    this.objetoAuxiliarLocal = new Opcion_Envio('Domicilio', 'Local', this.vectorTarifasLocal[indice].Tipo_Medida, null, null, 0, 999.99, 0);
    this.indiceEditarLocal = indice;

    if (this.vectorTarifasLocal[indice].Tipo_Medida == 'Peso') {
      this.banderaTarifaLocalPeso = true;
      this.banderaTarifaLocalPrecio = false;
    }

    if (this.vectorTarifasLocal[indice].Tipo_Medida == 'Precio') {
      this.banderaTarifaLocalPeso = false;
      this.banderaTarifaLocalPrecio = true;
    }
    // console.log('VESTOR TARIFA LOCAL' + JSON.stringify(this.objetoAuxiliarLocal));
    this.objetoAuxiliarLocal.Precio = this.vectorTarifasLocal[indice].Precio;
    this.objetoAuxiliarLocal.Minimo = this.vectorTarifasLocal[indice].Minimo;
    this.objetoAuxiliarLocal.Maximo = this.vectorTarifasLocal[indice].Maximo;
    // console.log('VESTOR ' + JSON.stringify(this.objetoAuxiliarLocal));

    this.banderaTipoAccionLocal = 'Editar';
    this.modalService.open(modalLocal, {centered: true, size: 'md', backdrop: "static"});
  }

  public eliminarTarifaLocal(indice) {
    this.vectorTarifasLocal.splice(indice, 1);
  }

  //FIN Envio a domicilio LOCAL

  //Envio a domicilio RESTO
  public abrirModalResto(modalResto) { //listo
    this.objetoAuxiliarResto = new Opcion_Envio('Domicilio', 'Resto', 'Peso', null, null, 0, 999.99, 0);
    this.banderaTarifaRestoPeso = true;
    this.banderaTarifaRestoPrecio = false;
    this.banderaTipoAccionResto = 'Agregar';
    this.modalService.open(modalResto, {centered: true, size: 'md', backdrop: "static"});
  }

  public opcTarifaResto(opcion, event) { //listo
    if (opcion == 'peso' && event.target.checked) {
      this.objetoAuxiliarResto.Tipo_Medida = 'Peso';
      this.banderaTarifaRestoPeso = true;
      this.banderaTarifaRestoPrecio = false;
    }

    if (opcion == 'precio' && event.target.checked) {
      this.objetoAuxiliarResto.Tipo_Medida = 'Precio';
      this.banderaTarifaRestoPeso = false;
      this.banderaTarifaRestoPrecio = true;
    }
  }

  public cancelarTarifaResto() {  //listo
    this.banderaTipoAccionResto = '';
    this.banderaTarifaRestoPeso = false;
    this.banderaTarifaRestoPrecio = false;
  }

  public agregarTarifaResto() {
    this.vectorTarifasResto.push(new Opcion_Envio(this.objetoAuxiliarResto.Tipo_Envio, this.objetoAuxiliarResto.Tipo_Ubicacion, this.objetoAuxiliarResto.Tipo_Medida, null, null, this.objetoAuxiliarResto.Minimo, this.objetoAuxiliarResto.Maximo, this.objetoAuxiliarResto.Precio));
  }

  public indiceEditarResto = 0;

  public editarTarifaResto() {
    this.vectorTarifasResto[this.indiceEditarResto].Tipo_Medida = this.objetoAuxiliarResto.Tipo_Medida;
    this.vectorTarifasResto[this.indiceEditarResto].Minimo = this.objetoAuxiliarResto.Minimo;
    this.vectorTarifasResto[this.indiceEditarResto].Maximo = this.objetoAuxiliarResto.Maximo;
    this.vectorTarifasResto[this.indiceEditarResto].Precio = this.objetoAuxiliarResto.Precio;
  }

  public editarAbrirTarifaResto(indice, modalResto) {
    this.objetoAuxiliarResto = '';
    this.objetoAuxiliarResto = new Opcion_Envio('Domicilio', 'Resto', this.vectorTarifasResto[indice].Tipo_Medida, null, null, 0, 999.99, 0);
    this.indiceEditarResto = indice;
    if (this.vectorTarifasResto[indice].Tipo_Medida == 'Peso') {
      this.banderaTarifaRestoPeso = true;
      this.banderaTarifaRestoPrecio = false;
    }

    if (this.vectorTarifasResto[indice].Tipo_Medida == 'Precio') {
      this.banderaTarifaRestoPeso = false;
      this.banderaTarifaRestoPrecio = true;
    }

    this.objetoAuxiliarResto.Precio = this.vectorTarifasResto[indice].Precio;
    this.objetoAuxiliarResto.Minimo = this.vectorTarifasResto[indice].Minimo;
    this.objetoAuxiliarResto.Maximo = this.vectorTarifasResto[indice].Maximo;
    this.banderaTipoAccionResto = 'Editar';
    this.modalService.open(modalResto, {centered: true, size: 'md', backdrop: "static"});
  }

  public eliminarTarifaResto(indice) {
    this.vectorTarifasResto.splice(indice, 1);
  }

  //FIN Envio a domicilio RESTO

  public transformar(element: any) {
    debugger;
    let valor = this.cp.transform(element.target.value, '$',);
    //let alter=formatCurrency(element.target.value,'USD',getCurrencySymbol('USD', 'wide'));
    let valor2 = valor.split("$");
    element.target.value = valor2[1].replace(',', "");
  }

  public habilitarEdicion() {
    this.banderaEdicionDeshabilitada = true;
  }

  public iniciarEdicion() {
    this.banderaslideRetiroLocal = document.getElementById('slideRetiroLocal') as HTMLInputElement;
    this.banderaslideEnvioDomicilio = document.getElementById('slideEnvioDomicilio') as HTMLInputElement;

    // console.log(this.banderaslideRetiroLocal + this.banderaslideEnvioDomicilio + 'ESTO ES EL SLIDE');

    this.objetoRetiroLocal = new Opcion_Envio('Retiro', null, null, null, 'Debes traer tu mensaje de confirmación e identificación cuando vengas a retirar tu pedido.', null, null, null);

    if (this.identidadTienda.OPCION_ENVIOs.length > 0) { //Hay algo en el vector metodo envio
      for (let me of this.identidadTienda.OPCION_ENVIOs) {
        if (me.TIPO_ENVIO == 'Retiro') {
          this.objetoRetiroLocal.Hora_Estimada_Retiro = me.HORA_ESTIMADA_RETIRO;
          this.objetoRetiroLocal.Instruccion_Retiro = me.INSTRUCCION_RETIRO;
          this.banderaslideRetiroLocal.checked = true;
          this.banderaRetiroLocal = true;
        }

        if (me.TIPO_ENVIO == 'Domicilio') {
          if (me.TIPO_UBICACION == "Local") {
            this.vectorTarifasLocal.push(new Opcion_Envio(me.TIPO_ENVIO, me.TIPO_UBICACION, me.TIPO_MEDIDA, null, null, me.MINIMO, me.MAXIMO, me.PRECIO));
          }

          if (me.TIPO_UBICACION == "Resto") {
            this.vectorTarifasResto.push(new Opcion_Envio(me.TIPO_ENVIO, me.TIPO_UBICACION, me.TIPO_MEDIDA, null, null, me.MINIMO, me.MAXIMO, me.PRECIO));
          }

          this.banderaslideEnvioDomicilio.checked = true;
          this.banderaEnvioDomicilio = true;
        }
      }
    } else {
      this.banderaslideRetiroLocal.checked = false;
      this.banderaRetiroLocal = false;

      this.banderaslideEnvioDomicilio.checked = false;
      this.banderaEnvioDomicilio = false;
    }

  }

  public async modificarMetodoEnvio() {
    try {
      debugger
      if (document.forms['formMetodoEnvio'].checkValidity()) {
        if (!this.vectorTarifasLocal.length && !this.vectorTarifasResto.length && this.banderaslideEnvioDomicilio.checked == true)
          this.mostrarToastError("Debes ingresar al menos una condición para activar el envio a domicilio", "");
        else {
          if (this.banderaslideRetiroLocal.checked == true) {
            this.vectorTotal.push(new Opcion_Envio(this.objetoRetiroLocal.Tipo_Envio, this.objetoRetiroLocal.Tipo_Ubicacion, this.objetoRetiroLocal.Tipo_Medida, this.objetoRetiroLocal.Hora_Estimada_Retiro, this.objetoRetiroLocal.Instruccion_Retiro, this.objetoRetiroLocal.Minimo, this.objetoRetiroLocal.Maximo, this.objetoRetiroLocal.Precio));
          }

          if (this.banderaslideEnvioDomicilio.checked == true) {
            if (this.vectorTarifasLocal.length > 0) {
              for (let dl of this.vectorTarifasLocal)
                this.vectorTotal.push(new Opcion_Envio(dl.Tipo_Envio, dl.Tipo_Ubicacion, dl.Tipo_Medida, dl.Hora_Estimada_Retiro, dl.Instruccion_Retiro, dl.Minimo, dl.Maximo, dl.Precio));
            }

            if (this.vectorTarifasResto.length > 0) {
              for (let dr of this.vectorTarifasResto)
                this.vectorTotal.push(new Opcion_Envio(dr.Tipo_Envio, dr.Tipo_Ubicacion, dr.Tipo_Medida, dr.Hora_Estimada_Retiro, dr.Instruccion_Retiro, dr.Minimo, dr.Maximo, dr.Precio));
            }
          }
          debugger

          this.loading = true;
          // console.log("VECTOR CON TODO" + JSON.stringify(this.vectorTotal));
          let response = await this._metodoEnvioServicio.guardarMetodoEnvio(this.identidadTienda.NUM_TIENDA, this.vectorTotal).toPromise();
          debugger
          let data = await this._tiendaServicio.getDatosTienda(this.identidadTienda.NUM_TIENDA).toPromise();
          localStorage.setItem("identityTienda", JSON.stringify(data['data']));
          this.cancelarModificacion();
          this.mensageCorrecto(response['message']);
          this.loading = false;
        }
      } else {
        this.mostrarToastError("Al parecer existe errores en el formulario, por favor reviselo nuevamente", "");
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

  public cancelarModificacion() {
    this.banderaRetiroLocal = false;
    this.banderaEnvioDomicilio = false;
    //this.banderaslideRetiroLocal = "";
    //this.banderaslideEnvioDomicilio  = "";
    this.banderaEdicionDeshabilitada = false;

    this.objetoRetiroLocal = "";

    this.vectorTotal = [];

    this.objetoAuxiliarLocal = "";
    this.vectorTarifasLocal = [];
    this.banderaTarifaLocalPeso = true;
    this.banderaTarifaLocalPrecio = false;

    this.objetoAuxiliarResto = "";
    this.vectorTarifasResto = [];
    this.banderaTarifaRestoPeso = true;
    this.banderaTarifaRestoPrecio = false;

    this.banderaTipoAccionLocal = "";
    this.banderaTipoAccionResto = "";

    this.loading = false;

    this.identidadTienda = this._tiendaServicio.getIdentityTienda();
    this.iniciarEdicion();
  }

  public mostrarToastError(mensaje, icono) {
    this.toastr.error('<div class="row no-gutters"><p align="justify" class="col-12 LetrasToastInfo"><strong>!Error</strong><br>' + mensaje + '</p> </div>', "",
      {positionClass: 'toast-top-right', enableHtml: true, closeButton: true});
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
        confirmButton: 'btn btn-primary px-5'
        //icon:'sm'
      }
    });
  }

}
