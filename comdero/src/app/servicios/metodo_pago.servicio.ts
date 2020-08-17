import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from "./global";
import {AgenteServicio} from "./agente.servicio";

//import { Http, Headers } from "@angular/http";

interface objeto {
  data: JSON,
  message:JSON
}

@Injectable()

export class MetodoPagoServicio {
  public url: String;


  constructor(private _http: HttpClient, private _agenteServicio: AgenteServicio) {
    this.url = GLOBAL.url;
  }

  saveMetodosPago(Id_Tienda, Metodo_Pago_Enviar) {
    let params = JSON.stringify(Metodo_Pago_Enviar);
    let headers = new HttpHeaders({"Content-type": "application/json","Authorization": this._agenteServicio.getToken()});
    return this._http.post<objeto>(this.url + "saveMetodosPago/" + Id_Tienda, params, {headers: headers});
  }

}
