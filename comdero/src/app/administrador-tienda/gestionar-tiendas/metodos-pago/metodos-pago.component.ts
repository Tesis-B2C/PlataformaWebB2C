import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from '@angular/platform-browser';
import {Metodo_Pago} from '../../../modelos/metodo-pago'


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

  constructor(private modalService: NgbModal, private _sanitizer: DomSanitizer) {

  }


  ngOnInit() {


  }


  ngOnDestroy() {
    console.log("destruyendo");
    delete this.Metodo_Pago_Electronico;
    delete this.Metodo_Pago_Transferencia;
    delete this.Metodo_Pago_Efectivo;

  }


  public opcionPagoEfectivo(bandera) {
    this.banderaPagoEfectivo=bandera;
    if (this.banderaPagoEfectivo == true) {
      this.Metodo_Pago_Efectivo = new Metodo_Pago(0, 0, "", "", "", 0, "");
      this.Metodo_Pago_Efectivo.Tipo_Pago = 'Efectivo'
    }else{
      delete this.Metodo_Pago_Efectivo;
    }

  }

  public opcionPagoTransferencia(bandera) {
    this.banderaPagoTransferencia = bandera;
    if (this.banderaPagoEfectivo == true) {
      this.Metodo_Pago_Transferencia = new Metodo_Pago(0, 0, "", "", "", 0, "");
      this.Metodo_Pago_Transferencia.Tipo_Pago = 'Transferencia'
    }else{
      delete this.Metodo_Pago_Transferencia;
    }
  }
public opcionTipoCuenta(value){
    this.Metodo_Pago_Transferencia.Tipo_Cuenta=value;
}

  public opcionPagoElectronico(bandera) {
    this.banderaPagoElectronico = bandera;
    if (this.banderaPagoElectronico== true) {
      this.Metodo_Pago_Electronico = new Metodo_Pago(0, 0, "", "", "", 0, "");
      this.Metodo_Pago_Electronico.Tipo_Pago = 'Electrónico'
    }else{
      delete this.Metodo_Pago_Electronico;
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


}
