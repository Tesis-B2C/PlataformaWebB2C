import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from '@angular/platform-browser';
import {Metodo_Pago} from '../../../modelos/metodo-pago'
import {MetodoPagoServicio} from '../../../servicios/metodo_pago.servicio';
import Swal from "sweetalert2";

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

  constructor(private _metodoPagoServicio: MetodoPagoServicio, private modalService: NgbModal, private _sanitizer: DomSanitizer) {
    this.Metodo_Pago_Efectivo = new Metodo_Pago(0, 0, "", "", "", 0, "Efectivo");
    this.Metodo_Pago_Transferencia = new Metodo_Pago(0, 0, "", "", "", 0, "Transferencia");
    this.Metodo_Pago_Electronico = new Metodo_Pago(0, 0, "", "", "", 0, "Electrónico");
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));


  }


  ngOnInit() {
    this.banderaSlidePagoElectronico = document.getElementById('slidePagoElectronico') as HTMLInputElement;
    this.banderaSlidePagoTransferencia = document.getElementById('slidePagoTransferencia') as HTMLInputElement;
    this.banderaSlidePagoEfectivo = document.getElementById('slidePagoEfectivo') as HTMLInputElement;
    this.iniciarEdicion();

  }


  ngOnDestroy() {
    console.log("destruyendo");
    delete this.Metodo_Pago_Electronico;
    delete this.Metodo_Pago_Transferencia;
    delete this.Metodo_Pago_Efectivo;
  }

  iniciarEdicion() {
    debugger;
    if (this.identidadTienda.METODO_PAGOs.length) {
      for (let mp of this.identidadTienda.MEDOTO_PAGOs) {
        if (mp.TIPO_PAGO = 'Efectivo') {
          this.Metodo_Pago_Efectivo.Porcentaje_Descuento = mp.PORCENTAJE_DESCUENTO;
          this.banderaSlidePagoEfectivo.checked = true;
        } else {
          this.banderaSlidePagoEfectivo.checked = false;
        }

        if (mp.TIPO_PAGO = 'Transferencia') {
          this.Metodo_Pago_Transferencia.Numero_Cuenta = mp.NUMERO_CUENTA;
          this.Metodo_Pago_Transferencia.Tipo_Cuenta = mp.TIPO_CUENTA;
          this.Metodo_Pago_Transferencia.Banco_Pertenece = mp.BANCO_PERTENECE;
          this.Metodo_Pago_Transferencia.Porcentaje_Descuento = mp.PORCENTAJE_DESCUENTO;
          this.banderaSlidePagoTransferencia.checked = true;
        } else {
          this.banderaSlidePagoTransferencia.checked = true;
        }

        if (mp.TIPO_PAGO = 'Electrónico') {
          this.Metodo_Pago_Electronico.Api_Key_Paypal = mp.API_KEY_PAYPAL;
          this.Metodo_Pago_Electronico.Porcentaje_Recargo = mp.PORCENTAJE_RECARGO;
          this.banderaSlidePagoEfectivo.checked = true;
        } else {
          this.banderaSlidePagoEfectivo.checked = false;
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
    }

  }

  public opcionPagoTransferencia(event) {

    if (event.target.checked) {
      this.banderaPagoTransferencia = true;
    } else {
      this.banderaPagoTransferencia = false;
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
      if (this.banderaSlidePagoEfectivo.checked) this.Metodo_Pago_Enviar.push(this.Metodo_Pago_Efectivo);
      if (this.banderaSlidePagoTransferencia.checked) this.Metodo_Pago_Enviar.push(this.Metodo_Pago_Transferencia);
      if (this.banderaSlidePagoElectronico.checked) this.Metodo_Pago_Enviar.push(this.Metodo_Pago_Electronico);

      let response = await this._metodoPagoServicio.saveMetodoPago(this.Metodo_Pago_Enviar).toPromise();
      this.mensageCorrecto(response.data);
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
  }

  public validar() {

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
      //footer: '<a href="http://localhost:4200/loguin"><b><u>Autentificate Ahora</u></b></a>',
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }

}
