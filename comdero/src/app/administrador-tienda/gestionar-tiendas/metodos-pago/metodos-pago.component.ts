import {Component, DoCheck, OnChanges, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.component.html',
  styleUrls: ['./metodos-pago.component.css']
})
export class MetodosPagoComponent implements OnInit {


public banderaPagoEfectivo:boolean=false;
public banderaPagoTransferencia:boolean=false;
public banderaPagoElectronico:boolean=false;


  constructor(private modalService: NgbModal,private _sanitizer: DomSanitizer){;
  }

  ngOnInit() {


  }
  public opcionPagoEfectivo(){
    this.banderaPagoEfectivo=!this.banderaPagoEfectivo;
  }

  public opcionPagoTransferencia(){
    this.banderaPagoTransferencia=!this.banderaPagoTransferencia;
  }


  public opcionPagoElectronico(){
    this.banderaPagoElectronico=!this.banderaPagoElectronico;
  }


  openBackDropCustomClass(content) {
    this.modalService.open(content, { centered: true ,size:'lg'});
  }

  getVideoIframe(url) {
    var video, results;

    if (url === null) {
      return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];

    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
  }











}
