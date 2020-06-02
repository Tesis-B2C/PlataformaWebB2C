import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-metodos-envio',
  templateUrl: './metodos-envio.component.html',
  styleUrls: ['./metodos-envio.component.css']
})
export class MetodosEnvioComponent implements OnInit {
  public banderaVerMasOpcionesDentroLocalidad: boolean = false;
  public banderaVerMasOpcionesFueraLocalidad: boolean = false;
  public banderaAgregarOpcionesDentroLocalidad: boolean = false;
  public banderaAgregarOpcionesFueraLocalidad: boolean = false;
  public vectorEnvioDentroLocalidad= new Array(1);
  constructor() {
  }

  ngOnInit() {
  }


  opcionVerMasOpcionesDentroLocalidad(event) {
    this.banderaVerMasOpcionesDentroLocalidad = !this.banderaVerMasOpcionesDentroLocalidad;
  }

  opcionVerMasOpcionesFueraLocalidad(event) {
    this.banderaVerMasOpcionesFueraLocalidad = !this.banderaVerMasOpcionesFueraLocalidad;
  }
  opcionAgregarOpcionesDentroLocalidad(event){
    this.banderaAgregarOpcionesDentroLocalidad = !this.banderaAgregarOpcionesDentroLocalidad;
  }
  opcionAgregarOpcionesFueraLocalidad(event){
    this.banderaAgregarOpcionesFueraLocalidad = !this.banderaAgregarOpcionesFueraLocalidad;
  }
}
