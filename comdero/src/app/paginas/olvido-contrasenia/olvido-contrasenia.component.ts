import { Component, OnInit } from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import Swal from "sweetalert2";
import {CorreoServicio} from "../../servicios/correo.servicio";
import {HttpErrorResponse} from "@angular/common/http";
@Component({
  selector: 'app-olvido-contrasenia',
  templateUrl: './olvido-contrasenia.component.html',
  styleUrls: ['./olvido-contrasenia.component.css']
})
export class OlvidoContraseniaComponent implements OnInit {

  public Correo;
  public  loading:boolean=false;
  constructor(public _correoServicio:CorreoServicio, public _agenteServicio: AgenteServicio) { }

  ngOnInit() {

  }
public response;
  public async resetearContrasenia() {
    this.loading = true;
    let obj={Correo: this.Correo}
    try {
     this.response= await this._agenteServicio.resetearContrasenia(obj).toPromise();
      this.mensageCorrecto(this.response.message);
      this.loading=false;
      let correoResponse=  await this._correoServicio.correoCambioContrasenia(this.response.data).toPromise();
      //this.mensageCorrecto(correoResponse.message);

    } catch (e) {
      this.loading = false;
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  public async reEnviar(){
    try {

    let correoResponse=  await this._correoServicio.correoCambioContrasenia(this.response.data).toPromise();
    this.mensageCorrecto(correoResponse.message);
    } catch (e) {
      this.loading = false;
      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
  }

  mensageError(mensaje)
  {
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

  mensageCorrecto(mensaje)
  {
    Swal.fire({
      icon: 'success',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Correcto..</h5></header>',
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
}
