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

  constructor(private _metodoPagoServicio: MetodoPagoServicio, private modalService: NgbModal, private _sanitizer: DomSanitizer) {
    this.Metodo_Pago_Efectivo = new Metodo_Pago(0, 0, "", "", "", 0, "Efectivo");
    this.Metodo_Pago_Transferencia = new Metodo_Pago(0, 0, "", "", "", 0, "Transferencia");
    this.Metodo_Pago_Electronico = new Metodo_Pago(0, 0, "", "", "", 0, "Electrónico");

  }


  ngOnInit() {


  }


  ngOnDestroy() {
    console.log("destruyendo");
    delete this.Metodo_Pago_Electronico;
    delete this.Metodo_Pago_Transferencia;
    delete this.Metodo_Pago_Efectivo;
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
      if (this.Metodo_Pago_Efectivo) this.Metodo_Pago_Enviar.push(this.Metodo_Pago_Efectivo);
      if (this.Metodo_Pago_Transferencia) this.Metodo_Pago_Enviar.push(this.Metodo_Pago_Transferencia);
      if (this.Metodo_Pago_Electronico) this.Metodo_Pago_Enviar.push(this.Metodo_Pago_Electronico);

      let response = await this._metodoPagoServicio.saveMetodoPago(this.Metodo_Pago_Enviar).toPromise();
      this.mensageCorrecto(response.data);
    } catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
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
      //footer: '<a href="http://localhost:4200/loguin"><b><u>Autentificate Ahora</u></b></a>',
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }

}
