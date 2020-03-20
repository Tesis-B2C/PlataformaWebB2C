import {Component} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-loguin',
  templateUrl: './loguin.component.html',
  styleUrls: ['./loguin.component.css']
})
export class LoguinComponent  {
  public obj = {
    Correo: null,
    Contrasenia: null
  };
  public identity;
  public token;
  public loading = false;
  public tokenTemporal;
  public response;
  constructor(private route: ActivatedRoute, private _agenteServicio: AgenteServicio, public router: Router) {

  }

  public async loguin() {
    try {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.tokenTemporal=params['params'].token;
      console.log("this.token",this.tokenTemporal);
    });
    if(!this.tokenTemporal){
     this.response = await this._agenteServicio.autenticarAgente(this.obj, "").toPromise();
    }else {
      this.response = await this._agenteServicio.autenticarActivarAgente(this.obj, "",this.tokenTemporal).toPromise();
    }
      this.identity = this.response.data;
      if (!this.identity.ID_AGENTE) {
        this.mensageError("el usuario no se ha logueado correctamente");

      } else {
        localStorage.setItem("identity", JSON.stringify(this.identity));
        let reponse2 = await this._agenteServicio.autenticarAgente(this.obj, "true").toPromise();
        this.loading = false;
        this.token = reponse2.token;
        if (this.token.length <= 0) {
          this.mensageError("el token nose ha generado");
        } else {
          localStorage.setItem("Token", this.token);
          this.router.navigate(['/menu/principal']);
        }
      }
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



}
