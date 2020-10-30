import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from '@angular/platform-browser';
import {Metodo_Pago} from '../../../modelos/metodo-pago'
import {MetodoPagoServicio} from '../../../servicios/metodo_pago.servicio';
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import {HttpErrorResponse} from "@angular/common/http";
@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.component.html',
  styleUrls: ['./metodos-pago.component.css']
})
export class MetodosPagoComponent implements OnInit, OnDestroy {


  public banderaPagoEfectivo: boolean = false;
  public banderaPagoTransferencia: boolean = false;
  public banderaPagoElectronico: boolean = false;
  public Metodo_Pago_Efectivo: Metodo_Pago;
  public Metodo_Pago_Transferencia: Metodo_Pago;
  public Metodo_Pago_Electronico: Metodo_Pago;
  public Metodo_Pago_Enviar = [];
  public identidadTienda;
  public banderaModificar: boolean = false;
  public banderaSlidePagoElectronico;
  public banderaSlidePagoTransferencia;
  public banderaSlidePagoEfectivo;
  public loading:boolean=false;

  constructor(public _tiendaServicio: TiendaServicio, public toastr: ToastrService, public _metodoPagoServicio: MetodoPagoServicio, public modalService: NgbModal, public _sanitizer: DomSanitizer) {


  }


  ngOnInit() {
    this.iniciarEdicion();

  }


  ngOnDestroy() {
    // console.log("destruyendo");
    delete this.Metodo_Pago_Electronico;
    delete this.Metodo_Pago_Transferencia;
    delete this.Metodo_Pago_Efectivo;
  }

  public banderaValidaciones: boolean = false;
  cancelar() {
  this.banderaValidaciones= false;
  debugger
    this.banderaPagoEfectivo = false;
    this.banderaPagoTransferencia = false;
    this.banderaPagoElectronico = false;
    this.banderaModificar = false;
    this.Metodo_Pago_Enviar = [];
    this.banderaSlidePagoElectronico = document.getElementById('slidePagoElectronico') as HTMLInputElement;
    this.banderaSlidePagoTransferencia = document.getElementById('slidePagoTransferencia') as HTMLInputElement;
    this.banderaSlidePagoEfectivo = document.getElementById('slidePagoEfectivo') as HTMLInputElement;
    this.Metodo_Pago_Efectivo = new Metodo_Pago(0, 0, "", "", "", 0, "Efectivo");
    this.Metodo_Pago_Transferencia = new Metodo_Pago(0, 0, "Ahorros", "", "", 0, "Transferencia");
    this.Metodo_Pago_Electronico = new Metodo_Pago(0, 0, "", "", "", 0, "Electrónico");
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));



  }

  iniciarEdicion() {

    this.cancelar();

    if (this.identidadTienda.METODO_PAGOs.length>0) {
      for (let mp of this.identidadTienda.METODO_PAGOs) {
        if (mp.TIPO_PAGO == 'Efectivo') {
          this.Metodo_Pago_Efectivo.Porcentaje_Descuento = mp.PORCENTAJE_DESCUENTO;
          this.banderaSlidePagoEfectivo.checked = true;
          this.banderaPagoEfectivo = true;
        }else {
          this.banderaSlidePagoEfectivo.checked = false;
        }

        if (mp.TIPO_PAGO == 'Transferencia') {
          this.Metodo_Pago_Transferencia.Numero_Cuenta = mp.NUMERO_CUENTA;
          this.Metodo_Pago_Transferencia.Tipo_Cuenta = mp.TIPO_CUENTA;
          this.Metodo_Pago_Transferencia.Banco_Pertenece = mp.BANCO_PERTENECE;
          this.Metodo_Pago_Transferencia.Porcentaje_Descuento = mp.PORCENTAJE_DESCUENTO;
          this.banderaSlidePagoTransferencia.checked = true;
          this.banderaPagoTransferencia = true;
        }else {
          this.banderaSlidePagoTransferencia.checked = false;
        }

        if (mp.TIPO_PAGO == 'Electrónico') {
          this.Metodo_Pago_Electronico.Api_Key_Paypal = mp.API_KEY_PAYPAL;
          this.Metodo_Pago_Electronico.Porcentaje_Recargo = mp.PORCENTAJE_RECARGO;
          this.banderaSlidePagoElectronico.checked = true;
          this.banderaPagoElectronico = true;
        }else {
          this.banderaSlidePagoElectronico.checked = false;
        }
      }
    } else {

      this.banderaSlidePagoElectronico.checked = false;
      this.banderaSlidePagoTransferencia.checked = false;
      this.banderaSlidePagoEfectivo.checked = false;
      this.Metodo_Pago_Efectivo = new Metodo_Pago(0, null, "", "", "", 0, "Efectivo");
      this.Metodo_Pago_Transferencia = new Metodo_Pago(0, null, "Ahorros", "", "", 0, "Transferencia");
      this.Metodo_Pago_Electronico = new Metodo_Pago(0, 0, "", "", "", 0, "Electrónico");


    }


  }


  public opcionPagoEfectivo(event) {
    if (event.target.checked) {
      this.banderaPagoEfectivo = true;
    } else {
      this.banderaPagoEfectivo = false;
      //this.Metodo_Pago_Efectivo = new Metodo_Pago(0, null, "", "", "", 0, "Efectivo");
    }

  }

  public opcionPagoTransferencia(event) {

    if (event.target.checked) {
      this.banderaPagoTransferencia = true;
    } else {
      this.banderaPagoTransferencia = false;
      //this.Metodo_Pago_Transferencia = new Metodo_Pago(0, null, "Ahorros", "", "", 0, "Transferencia");
    }

  }

  public opcionTipoCuenta(value) {
   this.Metodo_Pago_Transferencia.Tipo_Cuenta = value;
  }

  public opcionPagoElectronico(event) {
    if (event.target.checked) {
      this.banderaPagoElectronico = true;
    } else {
      this.banderaPagoElectronico = false;
      // this.Metodo_Pago_Electronico = new Metodo_Pago(0, 0, "", "", "", 0, "Electrónico");
    }
  }


  public abrirContentVideosAyuda(content) {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

  public getVideoIframe(url) {
    var video, results;

    if (url === null) {
      return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];

    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
  }

  public async saveMetodoPago() {
    try {
      this.banderaValidaciones=true;
      debugger;
      this.loading=true;
      if (document.forms["formMetodoPagoEfectivo"].checkValidity() && document.forms["formMetodoPagoTransferenciaBancaria"].checkValidity() && document.forms["formMetodoPagoElectronico"].checkValidity()) {
        if (this.banderaSlidePagoEfectivo.checked) this.Metodo_Pago_Enviar.push(this.Metodo_Pago_Efectivo);
        if (this.banderaSlidePagoTransferencia.checked) this.Metodo_Pago_Enviar.push(this.Metodo_Pago_Transferencia);
        if (this.banderaSlidePagoElectronico.checked) this.Metodo_Pago_Enviar.push(this.Metodo_Pago_Electronico);

        let response = await this._metodoPagoServicio.saveMetodosPago(this.identidadTienda.NUM_TIENDA, this.Metodo_Pago_Enviar).toPromise();
        this.mensageCorrecto(response.message);
        let identidadTienda = await this._tiendaServicio.getDatosTienda(this.identidadTienda.NUM_TIENDA).toPromise();
        localStorage.setItem("identityTienda", JSON.stringify(identidadTienda.data));
        this.iniciarEdicion();
        this.loading=false;
      } else {
        this.loading=false;
        this.toastr.error('<div class="row no-gutters"><p class="col-12 LetrasToastInfo">Existe errores en el formulario por favor revísalo nuevamente</p></div>', "Error!",
          {positionClass: 'toast-top-right', enableHtml: true, closeButton: true, disableTimeOut: false});
      }
    } catch (e) {
      this.loading=false;
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
