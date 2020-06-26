import {Component, OnInit} from '@angular/core';
import {Opcion_Envio} from "../../../modelos/opcion_envio";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-metodos-envio',
  templateUrl: './metodos-envio.component.html',
  styleUrls: ['./metodos-envio.component.css']
})
export class MetodosEnvioComponent implements OnInit {
  public disabledRetiroLocal = true;
  public disabledEnvioDomicilio = true;

  public activarTarifaLocalPeso = false;
  public activarTarifaLocalPrecio = false;
  public vectorTarifasLocal: Array<number> = [1];

  public vectorTarifasResto: Array<number> = [1];

  public Opcion_Envio:Opcion_Envio;

  constructor() {
    this.Opcion_Envio = new Opcion_Envio(null,null,null,null,null,null,null,null);
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

    if (opcion == 'precio' && event.target.checked)  {
      this.activarTarifaLocalPeso = false;
      this.activarTarifaLocalPrecio = true;
    }
  }

  public cancelarTarifaLocal(){
    this.activarTarifaLocalPeso = false;
    this.activarTarifaLocalPrecio = false;
  }

  public modal:NgbActiveModal;
  public agregarTarifaLocal(){
    this.vectorTarifasLocal.push(1);
    this.modal.close();
  }

  public eliminarTarifaLocal(indice){
    this.vectorTarifasLocal.splice(indice,1);
  }


}
