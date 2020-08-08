import { Component, OnInit } from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import Swal from "sweetalert2";
import {CorreoServicio} from "../../servicios/correo.servicio";
@Component({
  selector: 'app-olvido-contrasenia',
  templateUrl: './olvido-contrasenia.component.html',
  styleUrls: ['./olvido-contrasenia.component.css']
})
export class OlvidoContraseniaComponent implements OnInit {

  public Correo;
  public  loading:boolean=false;
  constructor(private _correoServicio:CorreoServicio, private _agenteServicio: AgenteServicio) { }

  ngOnInit() {

  }
public response;
  public async resetearContrasenia() {
    this.loading = true;
    let obj={Correo: this.Correo}
    try {
     this.response= await this._agenteServicio.resetearContrasenia(obj).toPromise();
      this.mensageCorrecto(this.response.message);
      let correoResponse=  await this._correoServicio.correoCambioContrasenia(this.response.data).toPromise();
      //this.mensageCorrecto(correoResponse.message);
       this.loading=false;
    } catch (e) {
      this.loading = false;
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
  }

  public async reEnviar(){
    try {

    let correoResponse=  await this._correoServicio.correoCambioContrasenia(this.response.data).toPromise();
    this.mensageCorrecto(correoResponse.message);
    } catch (e) {
      this.loading = false;
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
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
