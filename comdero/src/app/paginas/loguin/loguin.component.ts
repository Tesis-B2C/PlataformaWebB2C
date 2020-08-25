import {Component} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
@Component({
  selector: 'app-loguin',
  templateUrl: './loguin.component.html',
  styleUrls: ['./loguin.component.css']
})
export class LoguinComponent {
  public obj = {
    Correo: null,
    Contrasenia: null
  };
  public identity;
  public token;
  public loading: boolean = false;
  public tokenTemporal;
  public response;
  public payPalConfig: IPayPalConfig;
  constructor(private route: ActivatedRoute, private _agenteServicio: AgenteServicio, public router: Router) {
    this.initConfig();
  }
  initConfig() {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'Ae5SlhhgQC33YtMTKt0VJV-DlqFVJvWXGSzJNWRDGJLMolNPW_ppiGCy30nSyNlzv521TGmcXTeCuqiW',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',

        payer:{
          name:{
            given_name:'stteffano',
            surname:"Aguayo"
          },
          address: {
            address_line_1: '123 ABC Street',
            address_line_2: 'Apt 2',
            postal_code: '95121',
            country_code: 'EC',
            admin_area_2: 'Riobamba',
          },
          email_address: "tefo.aguayo@gmail.com",

        },

        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '0.02',
            /*  breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: '0.02'
                }
              }*/
            },


          }
        ],

      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        color:'blue',
        size:'responsive',
        shape:'pill',

      },

      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  public async loguin() {
    try {
      this.loading = true;
      this.tokenTemporal = this.route.snapshot.params.token;
      console.log("this.token", this.tokenTemporal);
      if (!this.tokenTemporal) {
        this.response = await this._agenteServicio.autenticarAgente(this.obj, "").toPromise();
      } else {
        this.response = await this._agenteServicio.autenticarActivarAgente(this.obj, "", this.tokenTemporal).toPromise();
      }
      debugger
      this.identity = this.response.data;
      if (!this.identity.CORREO) {
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
          this.router.navigate(['principales/menu/principal']);
        }
      }
    } catch (e) {
      this.loading = false;
      console.log("error", e);
      if (JSON.stringify((e).err.message))
        this.mensageError(JSON.stringify((e).err.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }
    this.loading = false;
  }


  mensageError(mensaje) {
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
