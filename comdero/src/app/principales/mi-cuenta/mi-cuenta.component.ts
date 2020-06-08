import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.css']
})
export class MiCuentaComponent implements OnInit {

  public banderaVisionGeneral:boolean;
  public banderaDatosPersoanles:boolean;
  public banderaListaDeseos:boolean;
  public banderaOrdenesRealizadas:boolean;
  public banderaAlaEsperaDeLaEntrega:boolean;
  public banderaArticulosEntregados:boolean;
  constructor() { }

  ngOnInit() {
  }

}
