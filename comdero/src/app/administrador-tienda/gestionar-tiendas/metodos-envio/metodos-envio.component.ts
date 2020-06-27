import {Component, OnInit} from '@angular/core';
import {Opcion_Envio} from "../../../modelos/opcion_envio";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-metodos-envio',
  templateUrl: './metodos-envio.component.html',
  styleUrls: ['./metodos-envio.component.css']
})
export class MetodosEnvioComponent implements OnInit {
  public disabledRetiroLocal = true;
  public disabledEnvioDomicilio = true;

  public Opcion_EnvioLocal: Opcion_Envio;
  public activarTarifaLocalPeso = false;
  public activarTarifaLocalPrecio = false;
  public vectorTarifasLocal: Array<number> = [1];

  public Opcion_EnvioResto: Opcion_Envio;
  public activarTarifaRestoPeso = false;
  public activarTarifaRestoPrecio = false;
  public vectorTarifasResto: Array<number> = [1];

  constructor(private cp: CurrencyPipe) {
    this.Opcion_EnvioLocal = new Opcion_Envio(null, null, null, null, null, null, null, null);
    this.Opcion_EnvioResto = new Opcion_Envio(null, null, null, null, null, null, null, null);
  }

  ngOnInit() {
  }

  public clickRetiroLocal(event) {
    if (event.target.checked) {
      this.disabledRetiroLocal = false;
    } else {
      this.disabledRetiroLocal = true;
    }
  }

  public clickEnvioDomicilio(event) {
    if (event.target.checked) {
      this.disabledEnvioDomicilio = false;
    } else {
      this.disabledEnvioDomicilio = true;
    }
  }

  public opcTarifa(opcion, event) {
    if (opcion == 'peso' && event.target.checked) {
      this.activarTarifaLocalPeso = true;
      this.activarTarifaLocalPrecio = false
    }

    if (opcion == 'precio' && event.target.checked) {
      this.activarTarifaLocalPeso = false;
      this.activarTarifaLocalPrecio = true;
    }
  }

  public cancelarTarifaLocal() {
    this.activarTarifaLocalPeso = false;
    this.activarTarifaLocalPrecio = false;
  }

  public agregarTarifaLocal() {
    this.vectorTarifasLocal.push(1);
  }

  public eliminarTarifaLocal(indice) {
    this.vectorTarifasLocal.splice(indice, 1);
  }

  public transformar(element: any) {
    debugger;
    let valor = this.cp.transform(element.target.value, '$',);
    //let alter=formatCurrency(element.target.value,'USD',getCurrencySymbol('USD', 'wide'));
    let valor2 = valor.split("$")
    element.target.value = valor2[1].replace(',', "");
  }

}
