import {AfterContentInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from '@angular/platform-browser';
import {NavigationStart, Router} from "@angular/router";


@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.component.html',
  styleUrls: ['./metodos-pago.component.css']
})
export class MetodosPagoComponent implements OnInit, OnDestroy {


  public banderaPagoEfectivo: boolean=false;
  public banderaPagoTransferencia: boolean=false;
  public banderaPagoElectronico: boolean=false;


  constructor(private modalService: NgbModal, private _sanitizer: DomSanitizer,router: Router) {
    router.events
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate') {
          console.log('Back button pressed2');
        }
      });
  }


  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
  }
  ngOnInit() {


  }



  ngOnDestroy() {
    console.log("destruyendo")

    this.elegir();
  }


  elegir() {
    if (confirm('se borran los datos')) {
      alert('borrar');
    } else {
      alert('no se borra nada');
    }
  }


  public opcionPagoEfectivo() {
    this.banderaPagoEfectivo = !this.banderaPagoEfectivo;
  }

  public opcionPagoTransferencia() {
    this.banderaPagoTransferencia = !this.banderaPagoTransferencia;
  }


  public opcionPagoElectronico() {
    this.banderaPagoElectronico = !this.banderaPagoElectronico;
  }


  openBackDropCustomClass(content) {
    this.modalService.open(content, {centered: true, size: 'lg'});
  }

  getVideoIframe(url) {
    var video, results;

    if (url === null) {
      return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];

    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
  }


}
