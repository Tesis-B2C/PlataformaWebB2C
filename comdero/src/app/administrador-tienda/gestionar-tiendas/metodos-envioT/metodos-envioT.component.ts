import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-metodos-envio',
  templateUrl: './metodos-envioT.component.html',
  styleUrls: ['./metodos-envioT.component.css']
})
export class MetodosEnvioTComponent implements OnInit {
  public banderaVerMasOpcionesDentroLocalidad: boolean = false;
  public banderaVerMasOpcionesFueraLocalidad: boolean = false;
  public banderaAgregarOpcionesDentroLocalidad: boolean = false;
  public banderaAgregarOpcionesFueraLocalidad: boolean = false;
  public vectorEnvioDentroLocalidad= new Array(1);
  public vectorVerMasEnvioDentroLocalidad= new Array(1);
  public vectorOtraEnvioDentroLocalidad= new Array(1);

  public vectorEnvioFueraLocalidad= new Array(1);
  public vectorVerMasEnvioFueraLocalidad= new Array(1);
  public vectorOtraEnvioFueraLocalidad= new Array(1);
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
  agregarOpcionesEnvioLocalidad(){
    this.vectorEnvioDentroLocalidad.push(1);
  }
  agregarVerMasOpcionesEnvioLocalidad(){
    this.vectorVerMasEnvioDentroLocalidad.push(1);
  }
  agregarOtrasOpcionesEnvioDentroLocalidad(){
    this.vectorOtraEnvioDentroLocalidad.push(1);
  }


  agregarOpcionesEnvioFueraLocalidad(){
    this.vectorEnvioFueraLocalidad.push(1);
  }
  agregarVerMasOpcionesEnvioFueraLocalidad(){
    this.vectorVerMasEnvioFueraLocalidad.push(1);
  }
  agregarOtrasOpcionesEnvioFueraLocalidad(){
    this.vectorOtraEnvioFueraLocalidad.push(1);
  }
}
