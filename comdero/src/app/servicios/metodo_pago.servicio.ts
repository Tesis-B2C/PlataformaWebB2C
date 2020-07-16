import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {GLOBAL} from "./global";

//import { Http, Headers } from "@angular/http";

interface objeto {
  data: JSON
}

@Injectable()

export class MetodoPagoServicio {
  public url: String;


  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  saveMetodosPago(Id_Tienda, Metodo_Pago_Enviar) {
    let params = JSON.stringify(Metodo_Pago_Enviar);
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this._http.post<objeto>(this.url + "saveMetodosPago/" + Id_Tienda, params, {headers: headers});
  }

}
