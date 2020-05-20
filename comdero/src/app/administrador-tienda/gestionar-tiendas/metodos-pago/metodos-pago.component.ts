import {Component, DoCheck, OnChanges, OnInit} from '@angular/core';


@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.component.html',
  styleUrls: ['./metodos-pago.component.css']
})
export class MetodosPagoComponent implements OnInit {


public banderaPagoEfectivo:boolean=false;
public banderaPagoTransferencia:boolean=false;
public banderaPagoElectronico:boolean=false;


  constructor(){;
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















}
